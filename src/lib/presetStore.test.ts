import { describe, expect, it } from "vitest";
import {
  normalizePresetName,
  PRESET_DATABASE_NAME,
  PRESET_DATABASE_VERSION,
  PRESET_OWNER_ORDER_INDEX,
  PresetRepository,
} from "./presetStore";
import { DEFAULT_NEST_APP_STATE } from "./storage";
import type { PresetRecord } from "./presetStore";

type RequestHandler = ((event: Event) => void) | null;

class MemoryRequest<T> {
  result!: T;
  error: DOMException | null = null;
  onsuccess: RequestHandler = null;
  onerror: RequestHandler = null;
}

interface MemoryRange {
  lower: IDBValidKey;
  upper: IDBValidKey;
}

class MemoryTransaction {
  error: DOMException | null = null;
  oncomplete: RequestHandler = null;
  onerror: RequestHandler = null;
  onabort: RequestHandler = null;
  private pending = 0;
  private completionTimer: ReturnType<typeof setTimeout> | null = null;
  private aborted = false;

  constructor(private readonly database: MemoryIndexedDB) {}

  objectStore(): IDBObjectStore {
    const request = <T>(operation: () => T): IDBRequest<T> => {
      const result = new MemoryRequest<T>();
      this.pending += 1;
      queueMicrotask(() => {
        if (this.aborted) return;
        try {
          result.result = operation();
          result.onsuccess?.({} as Event);
        } catch (error) {
          result.error = error as DOMException;
          result.onerror?.({} as Event);
        } finally {
          this.pending -= 1;
          this.scheduleCompletion();
        }
      });
      return result as unknown as IDBRequest<T>;
    };

    const ownerRecords = (range?: IDBKeyRange) => {
      const owner = range
        ? String(((range as unknown as MemoryRange).lower as IDBValidKey[])[0])
        : null;
      return [...this.database.records.values()]
        .filter((record) => owner === null || record.ownerClerkUserId === owner)
        .sort(
          (left, right) =>
            left.sortOrder - right.sortOrder ||
            left.presetId.localeCompare(right.presetId),
        )
        .map((record) => structuredClone(record));
    };

    return {
      index: () =>
        ({
          getAll: (range?: IDBKeyRange) => request(() => ownerRecords(range)),
        }) as IDBIndex,
      get: (key: IDBValidKey | IDBKeyRange) =>
        request(() => {
          const [ownerClerkUserId, presetId] = key as IDBValidKey[];
          const record = this.database.records.get(
            `${String(ownerClerkUserId)}\u0000${String(presetId)}`,
          );
          return record ? structuredClone(record) : undefined;
        }),
      put: (value: PresetRecord) =>
        request(() => {
          const copy = structuredClone(value);
          this.database.records.set(
            `${copy.ownerClerkUserId}\u0000${copy.presetId}`,
            copy,
          );
          return [copy.ownerClerkUserId, copy.presetId] as IDBValidKey;
        }),
      delete: (key: IDBValidKey | IDBKeyRange) =>
        request(() => {
          const [ownerClerkUserId, presetId] = key as IDBValidKey[];
          this.database.records.delete(
            `${String(ownerClerkUserId)}\u0000${String(presetId)}`,
          );
        }),
    } as unknown as IDBObjectStore;
  }

  abort() {
    this.aborted = true;
    if (this.completionTimer) clearTimeout(this.completionTimer);
    queueMicrotask(() => this.onabort?.({} as Event));
  }

  begin() {
    this.scheduleCompletion();
  }

  private scheduleCompletion() {
    if (this.aborted || this.pending !== 0) return;
    if (this.completionTimer) clearTimeout(this.completionTimer);
    this.completionTimer = setTimeout(() => {
      if (!this.aborted && this.pending === 0) {
        if (this.database.abortNextTransactionWith) {
          this.error = this.database.abortNextTransactionWith;
          this.database.abortNextTransactionWith = null;
          this.aborted = true;
          this.onabort?.({} as Event);
          return;
        }
        this.oncomplete?.({} as Event);
      }
    }, 0);
  }
}

class MemoryIndexedDB {
  readonly records = new Map<string, PresetRecord>();
  abortNextTransactionWith: DOMException | null = null;
  openedName: string | null = null;
  openedVersion: number | null = null;
  keyPath: string[] | null = null;
  indexName: string | null = null;
  indexKeyPath: string[] | null = null;
  indexUnique: boolean | null = null;
  private initialized = false;

  open(name: string, version?: number): IDBOpenDBRequest {
    this.openedName = name;
    this.openedVersion = version ?? null;
    const request = new MemoryRequest<IDBDatabase>() as MemoryRequest<IDBDatabase> & {
      onupgradeneeded: RequestHandler;
      onblocked: RequestHandler;
      transaction: IDBTransaction | null;
    };
    request.onupgradeneeded = null;
    request.onblocked = null;
    request.transaction = null;

    const database = {
      objectStoreNames: {
        contains: (storeName: string) =>
          this.initialized && storeName === "presets",
      },
      createObjectStore: (_storeName: string, options?: IDBObjectStoreParameters) => {
        void _storeName;
        this.keyPath = options?.keyPath as string[];
        return {
          createIndex: (
            indexName: string,
            keyPath: string | string[],
            options?: IDBIndexParameters,
          ) => {
            this.indexName = indexName;
            this.indexKeyPath = keyPath as string[];
            this.indexUnique = options?.unique ?? false;
          },
        } as IDBObjectStore;
      },
      transaction: (_storeName: string, _mode?: IDBTransactionMode) => {
        void _storeName;
        void _mode;
        const transaction = new MemoryTransaction(this);
        queueMicrotask(() => transaction.begin());
        return transaction as unknown as IDBTransaction;
      },
      close: () => undefined,
      onversionchange: null,
      onclose: null,
    } as unknown as IDBDatabase;

    queueMicrotask(() => {
      request.result = database;
      if (!this.initialized) {
        request.onupgradeneeded?.({} as Event);
        this.initialized = true;
      }
      request.onsuccess?.({} as Event);
    });

    return request as unknown as IDBOpenDBRequest;
  }
}

const memoryKeyRange = {
  bound: (lower: IDBValidKey, upper: IDBValidKey) =>
    ({ lower, upper }) as unknown as IDBKeyRange,
};

function createMemoryRepository(
  now: () => Date = () => new Date("2026-07-31T12:00:00.000Z"),
  randomUUID: () => string = () =>
    "123e4567-e89b-42d3-a456-426614174000",
) {
  const database = new MemoryIndexedDB();
  const repository = new PresetRepository({
    indexedDB: database as unknown as IDBFactory,
    keyRange: memoryKeyRange,
    randomUUID,
    now,
  });
  return { database, repository };
}

describe("PresetRepository", () => {
  it("trims names and counts Unicode code points at the 64-character boundary", () => {
    expect(normalizePresetName("  Shop setup  ")).toBe("Shop setup");
    expect(normalizePresetName("🧰".repeat(64))).toBe("🧰".repeat(64));

    for (const invalidName of ["   ", "🧰".repeat(65)]) {
      expect(() => normalizePresetName(invalidName)).toThrowError(
        expect.objectContaining({
          name: "PresetStoreError",
          code: "invalid-name",
        }),
      );
    }
  });

  it("surfaces unavailable browser persistence instead of claiming an empty collection", async () => {
    const repository = new PresetRepository({ indexedDB: null });

    await expect(repository.listPresets("user_123")).rejects.toMatchObject({
      name: "PresetStoreError",
      code: "unavailable",
    });
  });

  it("rejects missing owners and non-version-3 snapshots before opening storage", async () => {
    const { database, repository } = createMemoryRepository();

    await expect(repository.listPresets("" as string)).rejects.toMatchObject({
      code: "invalid-owner",
    });
    await expect(
      repository.createPreset("user_123", "Fixture A", {
        ...DEFAULT_NEST_APP_STATE,
        version: 2,
      } as never),
    ).rejects.toMatchObject({
      code: "invalid-snapshot",
    });
    expect(database.openedName).toBeNull();
  });

  it("creates the exact v1 IndexedDB schema and returns a detached owner-scoped record", async () => {
    const { database, repository } = createMemoryRepository();
    const source = {
      ...DEFAULT_NEST_APP_STATE,
      manualInputs: {
        ...DEFAULT_NEST_APP_STATE.manualInputs,
        partWidth: 9,
      },
    };

    const created = await repository.createPreset(
      "user_123",
      "  Fixture A  ",
      source,
    );
    source.manualInputs.partWidth = 99;

    expect(database).toMatchObject({
      openedName: PRESET_DATABASE_NAME,
      openedVersion: PRESET_DATABASE_VERSION,
      keyPath: ["ownerClerkUserId", "presetId"],
      indexName: PRESET_OWNER_ORDER_INDEX,
      indexKeyPath: ["ownerClerkUserId", "sortOrder"],
      indexUnique: false,
    });
    expect(created).toEqual({
      schemaVersion: 1,
      ownerClerkUserId: "user_123",
      presetId: "123e4567-e89b-42d3-a456-426614174000",
      name: "Fixture A",
      sortOrder: 0,
      snapshot: {
        ...DEFAULT_NEST_APP_STATE,
        manualInputs: {
          ...DEFAULT_NEST_APP_STATE.manualInputs,
          partWidth: 9,
        },
      },
      createdAt: "2026-07-31T12:00:00.000Z",
      updatedAt: "2026-07-31T12:00:00.000Z",
    });
    expect(await repository.listPresets("user_123")).toEqual([created]);
    expect(await repository.listPresets("user_other")).toEqual([]);
  });

  it("rejects duplicate names case-insensitively within one owner", async () => {
    const { repository } = createMemoryRepository();
    await repository.createPreset(
      "user_123",
      "Fixture A",
      DEFAULT_NEST_APP_STATE,
    );

    await expect(
      repository.createPreset(
        "user_123",
        "  fIxTuRe A  ",
        DEFAULT_NEST_APP_STATE,
      ),
    ).rejects.toMatchObject({
      code: "duplicate-name",
    });

    await expect(
      repository.createPreset(
        "user_other",
        "Fixture A",
        DEFAULT_NEST_APP_STATE,
      ),
    ).resolves.toMatchObject({ ownerClerkUserId: "user_other" });
  });

  it("loads only through the compound owner key and returns a detached normalized snapshot", async () => {
    const { repository } = createMemoryRepository();
    const created = await repository.createPreset(
      "user_123",
      "Fixture A",
      {
        ...DEFAULT_NEST_APP_STATE,
        manualInputs: {
          ...DEFAULT_NEST_APP_STATE.manualInputs,
          partHeight: 4,
        },
      },
    );

    await expect(
      repository.loadPreset("user_other", created.presetId),
    ).rejects.toMatchObject({ code: "not-found" });

    const loaded = await repository.loadPreset("user_123", created.presetId);
    loaded.manualInputs.partHeight = 99;
    expect(
      (await repository.loadPreset("user_123", created.presetId)).manualInputs
        .partHeight,
    ).toBe(4);
  });

  it("overwrites only the selected owner record after normalizing the replacement snapshot", async () => {
    const timestamps = [
      new Date("2026-07-31T12:00:00.000Z"),
      new Date("2026-07-31T12:01:00.000Z"),
    ];
    const { repository } = createMemoryRepository(
      () => timestamps.shift() ?? new Date("2026-07-31T12:01:00.000Z"),
    );
    const created = await repository.createPreset(
      "user_123",
      "Fixture A",
      DEFAULT_NEST_APP_STATE,
    );
    const replacement = {
      ...DEFAULT_NEST_APP_STATE,
      mode: "autonest" as const,
      manualInputs: {
        ...DEFAULT_NEST_APP_STATE.manualInputs,
        remnantWidth: 48,
      },
    };

    await expect(
      repository.overwritePreset(
        "user_other",
        created.presetId,
        replacement,
      ),
    ).rejects.toMatchObject({ code: "not-found" });

    const overwritten = await repository.overwritePreset(
      "user_123",
      created.presetId,
      replacement,
    );
    replacement.manualInputs.remnantWidth = 99;

    expect(overwritten).toEqual({
      ...created,
      snapshot: {
        ...replacement,
        manualInputs: {
          ...replacement.manualInputs,
          remnantWidth: 48,
        },
      },
      updatedAt: "2026-07-31T12:01:00.000Z",
    });
    expect(
      (await repository.loadPreset("user_123", created.presetId)).manualInputs
        .remnantWidth,
    ).toBe(48);
  });

  it("renames by owner and preset ID while enforcing owner-local case-insensitive uniqueness", async () => {
    const ids = [
      "123e4567-e89b-42d3-a456-426614174000",
      "223e4567-e89b-42d3-a456-426614174000",
    ];
    const times = [
      "2026-07-31T12:00:00.000Z",
      "2026-07-31T12:01:00.000Z",
      "2026-07-31T12:02:00.000Z",
    ];
    const { repository } = createMemoryRepository(
      () => new Date(times.shift() ?? "2026-07-31T12:02:00.000Z"),
      () => ids.shift() ?? "323e4567-e89b-42d3-a456-426614174000",
    );
    const first = await repository.createPreset(
      "user_123",
      "Fixture A",
      DEFAULT_NEST_APP_STATE,
    );
    await repository.createPreset(
      "user_123",
      "Fixture B",
      DEFAULT_NEST_APP_STATE,
    );

    await expect(
      repository.renamePreset("user_123", first.presetId, " fixture b "),
    ).rejects.toMatchObject({
      code: "duplicate-name",
    });
    await expect(
      repository.renamePreset("user_other", first.presetId, "Fixture C"),
    ).rejects.toMatchObject({ code: "not-found" });

    await expect(
      repository.renamePreset("user_123", first.presetId, "  Fixture C "),
    ).resolves.toMatchObject({
      ...first,
      name: "Fixture C",
      updatedAt: "2026-07-31T12:02:00.000Z",
    });
  });

  it("rewrites the complete owner order contiguously in the requested deterministic order", async () => {
    const ids = [
      "123e4567-e89b-42d3-a456-426614174000",
      "223e4567-e89b-42d3-a456-426614174000",
      "323e4567-e89b-42d3-a456-426614174000",
    ];
    const { repository } = createMemoryRepository(
      undefined,
      () => ids.shift() ?? "423e4567-e89b-42d3-a456-426614174000",
    );
    const first = await repository.createPreset(
      "user_123",
      "First",
      DEFAULT_NEST_APP_STATE,
    );
    const second = await repository.createPreset(
      "user_123",
      "Second",
      DEFAULT_NEST_APP_STATE,
    );
    const third = await repository.createPreset(
      "user_123",
      "Third",
      DEFAULT_NEST_APP_STATE,
    );

    await expect(
      repository.reorderPresets("user_123", [third.presetId, first.presetId]),
    ).rejects.toMatchObject({
      code: "invalid-order",
    });

    const reordered = await repository.reorderPresets("user_123", [
      third.presetId,
      first.presetId,
      second.presetId,
    ]);

    expect(reordered.map(({ presetId, sortOrder }) => ({ presetId, sortOrder })))
      .toEqual([
        { presetId: third.presetId, sortOrder: 0 },
        { presetId: first.presetId, sortOrder: 1 },
        { presetId: second.presetId, sortOrder: 2 },
      ]);
    expect(
      (await repository.listPresets("user_123")).map((record) => record.presetId),
    ).toEqual([third.presetId, first.presetId, second.presetId]);
  });

  it("deletes by compound owner key and compacts the remaining order", async () => {
    const ids = [
      "123e4567-e89b-42d3-a456-426614174000",
      "223e4567-e89b-42d3-a456-426614174000",
      "323e4567-e89b-42d3-a456-426614174000",
    ];
    const { repository } = createMemoryRepository(
      undefined,
      () => ids.shift() ?? "423e4567-e89b-42d3-a456-426614174000",
    );
    const first = await repository.createPreset(
      "user_123",
      "First",
      DEFAULT_NEST_APP_STATE,
    );
    const second = await repository.createPreset(
      "user_123",
      "Second",
      DEFAULT_NEST_APP_STATE,
    );
    const third = await repository.createPreset(
      "user_123",
      "Third",
      DEFAULT_NEST_APP_STATE,
    );

    await expect(
      repository.deletePreset("user_other", second.presetId),
    ).rejects.toMatchObject({ code: "not-found" });
    await expect(
      repository.deletePreset("user_123", second.presetId),
    ).resolves.toBeUndefined();

    expect(
      (await repository.listPresets("user_123")).map(
        ({ presetId, sortOrder }) => ({ presetId, sortOrder }),
      ),
    ).toEqual([
      { presetId: first.presetId, sortOrder: 0 },
      { presetId: third.presetId, sortOrder: 1 },
    ]);
    await expect(
      repository.loadPreset("user_123", second.presetId),
    ).rejects.toMatchObject({ code: "not-found" });
  });

  it("reports an aborted persistence transaction instead of resolving after the request", async () => {
    const { database, repository } = createMemoryRepository();
    database.abortNextTransactionWith = new DOMException(
      "Storage quota unavailable",
      "QuotaExceededError",
    );

    await expect(
      repository.createPreset(
        "user_123",
        "Fixture A",
        DEFAULT_NEST_APP_STATE,
      ),
    ).rejects.toMatchObject({
      code: "transaction-failed",
      cause: expect.objectContaining({ name: "QuotaExceededError" }),
      message: expect.stringMatching(/quota/i),
    });
  });
});
