import { normalizeNestAppState } from "./storage";
import type { NestAppState } from "./types";

export const PRESET_DATABASE_NAME = "nestcalc-presets";
export const PRESET_DATABASE_VERSION = 1;
export const PRESET_STORE_NAME = "presets";
export const PRESET_OWNER_ORDER_INDEX = "by-owner-order";
export const PRESET_SCHEMA_VERSION = 1;

export interface PresetRecord {
  schemaVersion: 1;
  ownerClerkUserId: string;
  presetId: string;
  name: string;
  sortOrder: number;
  snapshot: NestAppState;
  createdAt: string;
  updatedAt: string;
}

export type PresetStoreErrorCode =
  | "unavailable"
  | "open-failed"
  | "transaction-failed"
  | "invalid-owner"
  | "invalid-name"
  | "duplicate-name"
  | "not-found"
  | "invalid-snapshot"
  | "invalid-order";

export class PresetStoreError extends Error {
  readonly code: PresetStoreErrorCode;
  override readonly cause?: unknown;

  constructor(code: PresetStoreErrorCode, message: string, cause?: unknown) {
    super(message);
    this.name = "PresetStoreError";
    this.code = code;
    this.cause = cause;
  }
}

export function normalizePresetName(name: string): string {
  if (typeof name !== "string") {
    throw new PresetStoreError(
      "invalid-name",
      "Preset name must contain between 1 and 64 characters.",
    );
  }

  const normalized = name.trim();
  const length = Array.from(normalized).length;
  if (length < 1 || length > 64) {
    throw new PresetStoreError(
      "invalid-name",
      "Preset name must contain between 1 and 64 characters.",
    );
  }

  return normalized;
}

export interface PresetRepositoryOptions {
  indexedDB?: IDBFactory | null;
  keyRange?: Pick<typeof IDBKeyRange, "bound"> | null;
  randomUUID?: () => string;
  now?: () => Date;
}

function browserIndexedDB(): IDBFactory | null {
  return typeof indexedDB === "undefined" ? null : indexedDB;
}

function browserKeyRange(): Pick<typeof IDBKeyRange, "bound"> | null {
  return typeof IDBKeyRange === "undefined" ? null : IDBKeyRange;
}

function browserRandomUUID(): string {
  if (typeof crypto === "undefined" || !crypto.randomUUID) {
    throw new PresetStoreError(
      "unavailable",
      "Secure preset identifiers are unavailable in this browser.",
    );
  }
  return crypto.randomUUID();
}

function validateOwner(ownerClerkUserId: string): string {
  if (
    typeof ownerClerkUserId !== "string" ||
    ownerClerkUserId.length === 0 ||
    ownerClerkUserId.trim().length === 0
  ) {
    throw new PresetStoreError(
      "invalid-owner",
      "A signed-in Clerk user is required for preset storage.",
    );
  }
  return ownerClerkUserId;
}

function normalizeSnapshot(snapshot: unknown): NestAppState {
  try {
    return normalizeNestAppState(snapshot);
  } catch (error) {
    throw new PresetStoreError(
      "invalid-snapshot",
      "Preset snapshot is not a valid NestCalc version-3 state.",
      error,
    );
  }
}

function storageFailureMessage(
  fallback: string,
  cause: unknown,
): string {
  const name =
    cause !== null && typeof cause === "object" && "name" in cause
      ? String(cause.name)
      : "";
  switch (name) {
    case "QuotaExceededError":
      return "Preset storage quota was exceeded; the change was not saved.";
    case "AbortError":
      return "Preset storage transaction was aborted; the change was not saved.";
    case "SecurityError":
    case "NotAllowedError":
      return "Preset storage is blocked in this browser or private mode.";
    case "InvalidStateError":
      return "Preset storage is unavailable or was evicted; reload and try again.";
    default:
      return fallback;
  }
}

function requestResult<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ?? new DOMException("IndexedDB request failed", "UnknownError"),
      );
  });
}

function transactionCompletion(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () =>
      reject(
        transaction.error ??
          new DOMException("IndexedDB transaction failed", "UnknownError"),
      );
    transaction.onabort = () =>
      reject(
        transaction.error ??
          new DOMException("IndexedDB transaction aborted", "AbortError"),
      );
  });
}

function ownerRange(
  keyRange: Pick<typeof IDBKeyRange, "bound">,
  ownerClerkUserId: string,
): IDBKeyRange {
  return keyRange.bound(
    [ownerClerkUserId, 0],
    [ownerClerkUserId, Number.MAX_SAFE_INTEGER],
  );
}

function sortRecords(records: PresetRecord[]): PresetRecord[] {
  return records.sort(
    (left, right) =>
      left.sortOrder - right.sortOrder ||
      left.presetId.localeCompare(right.presetId),
  );
}

export class PresetRepository {
  private readonly indexedDB: IDBFactory | null;
  private readonly keyRange: Pick<typeof IDBKeyRange, "bound"> | null;
  private readonly randomUUID: () => string;
  private readonly now: () => Date;
  private databasePromise: Promise<IDBDatabase> | null = null;

  constructor(options: PresetRepositoryOptions = {}) {
    this.indexedDB =
      options.indexedDB === undefined ? browserIndexedDB() : options.indexedDB;
    this.keyRange =
      options.keyRange === undefined ? browserKeyRange() : options.keyRange;
    this.randomUUID = options.randomUUID ?? browserRandomUUID;
    this.now = options.now ?? (() => new Date());
  }

  async listPresets(ownerClerkUserId: string): Promise<PresetRecord[]> {
    const owner = validateOwner(ownerClerkUserId);
    return this.withTransaction("readonly", async (store) => {
      const records = await this.readOwnerRecords(store, owner);
      return sortRecords(records).map((record) => ({
        ...record,
        snapshot: normalizeSnapshot(record.snapshot),
      }));
    });
  }

  async createPreset(
    ownerClerkUserId: string,
    name: string,
    snapshot: NestAppState,
  ): Promise<PresetRecord> {
    const owner = validateOwner(ownerClerkUserId);
    const normalizedName = normalizePresetName(name);
    const normalizedSnapshot = normalizeSnapshot(snapshot);

    return this.withTransaction("readwrite", async (store) => {
      const records = await this.readOwnerRecords(store, owner);
      this.assertUniqueName(records, normalizedName);
      const timestamp = this.now().toISOString();
      const record: PresetRecord = {
        schemaVersion: PRESET_SCHEMA_VERSION,
        ownerClerkUserId: owner,
        presetId: this.randomUUID(),
        name: normalizedName,
        sortOrder: records.length,
        snapshot: normalizedSnapshot,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      await requestResult(store.put(record));
      return structuredClone(record);
    });
  }

  async loadPreset(
    ownerClerkUserId: string,
    presetId: string,
  ): Promise<NestAppState> {
    const owner = validateOwner(ownerClerkUserId);
    return this.withTransaction("readonly", async (store) => {
      const record = (await requestResult(
        store.get([owner, presetId]),
      )) as PresetRecord | undefined;
      if (!record) {
        throw new PresetStoreError(
          "not-found",
          "Preset was not found for the signed-in user.",
        );
      }
      return normalizeSnapshot(record.snapshot);
    });
  }

  async overwritePreset(
    ownerClerkUserId: string,
    presetId: string,
    snapshot: NestAppState,
  ): Promise<PresetRecord> {
    const owner = validateOwner(ownerClerkUserId);
    const normalizedSnapshot = normalizeSnapshot(snapshot);
    return this.withTransaction("readwrite", async (store) => {
      const existing = await this.requireRecord(store, owner, presetId);
      const replacement: PresetRecord = {
        ...existing,
        ownerClerkUserId: owner,
        presetId,
        snapshot: normalizedSnapshot,
        updatedAt: this.now().toISOString(),
      };
      await requestResult(store.put(replacement));
      return structuredClone(replacement);
    });
  }

  async renamePreset(
    ownerClerkUserId: string,
    presetId: string,
    name: string,
  ): Promise<PresetRecord> {
    const owner = validateOwner(ownerClerkUserId);
    const normalizedName = normalizePresetName(name);
    return this.withTransaction("readwrite", async (store) => {
      const records = await this.readOwnerRecords(store, owner);
      const existing = records.find((record) => record.presetId === presetId);
      if (!existing) {
        throw new PresetStoreError(
          "not-found",
          "Preset was not found for the signed-in user.",
        );
      }
      this.assertUniqueName(records, normalizedName, presetId);
      const replacement: PresetRecord = {
        ...existing,
        name: normalizedName,
        updatedAt: this.now().toISOString(),
      };
      await requestResult(store.put(replacement));
      return structuredClone(replacement);
    });
  }

  async reorderPresets(
    ownerClerkUserId: string,
    orderedPresetIds: string[],
  ): Promise<PresetRecord[]> {
    const owner = validateOwner(ownerClerkUserId);
    return this.withTransaction("readwrite", async (store) => {
      const records = await this.readOwnerRecords(store, owner);
      const requestedIds = new Set(orderedPresetIds);
      if (
        requestedIds.size !== orderedPresetIds.length ||
        orderedPresetIds.length !== records.length ||
        records.some((record) => !requestedIds.has(record.presetId))
      ) {
        throw new PresetStoreError(
          "invalid-order",
          "Preset reorder must include every preset for this owner exactly once.",
        );
      }

      const recordsById = new Map(
        records.map((record) => [record.presetId, record]),
      );
      const timestamp = this.now().toISOString();
      const reordered = orderedPresetIds.map((presetId, sortOrder) => ({
        ...(recordsById.get(presetId) as PresetRecord),
        sortOrder,
        updatedAt: timestamp,
      }));
      await Promise.all(reordered.map((record) => requestResult(store.put(record))));
      return reordered.map((record) => structuredClone(record));
    });
  }

  async deletePreset(
    ownerClerkUserId: string,
    presetId: string,
  ): Promise<void> {
    const owner = validateOwner(ownerClerkUserId);
    await this.withTransaction("readwrite", async (store) => {
      const records = sortRecords(await this.readOwnerRecords(store, owner));
      if (!records.some((record) => record.presetId === presetId)) {
        throw new PresetStoreError(
          "not-found",
          "Preset was not found for the signed-in user.",
        );
      }

      await requestResult(store.delete([owner, presetId]));
      const timestamp = this.now().toISOString();
      const moved = records
        .filter((record) => record.presetId !== presetId)
        .flatMap((record, sortOrder) =>
          record.sortOrder === sortOrder
            ? []
            : [{ ...record, sortOrder, updatedAt: timestamp }],
        );
      await Promise.all(moved.map((record) => requestResult(store.put(record))));
    });
  }

  private requireBackend(): {
    indexedDB: IDBFactory;
    keyRange: Pick<typeof IDBKeyRange, "bound">;
  } {
    if (!this.indexedDB || !this.keyRange) {
      throw new PresetStoreError(
        "unavailable",
        "Preset storage is unavailable in this browser or storage mode.",
      );
    }
    return { indexedDB: this.indexedDB, keyRange: this.keyRange };
  }

  private openDatabase(): Promise<IDBDatabase> {
    const { indexedDB } = this.requireBackend();
    if (this.databasePromise) return this.databasePromise;

    const promiseRef: { current: Promise<IDBDatabase> | null } = {
      current: null,
    };
    const openingPromise = new Promise<IDBDatabase>((resolve, reject) => {
      let request: IDBOpenDBRequest;
      try {
        request = indexedDB.open(
          PRESET_DATABASE_NAME,
          PRESET_DATABASE_VERSION,
        );
      } catch (error) {
        reject(
          new PresetStoreError(
            "open-failed",
            storageFailureMessage(
              "Preset storage could not be opened.",
              error,
            ),
            error,
          ),
        );
        return;
      }

      request.onupgradeneeded = () => {
        const database = request.result;
        if (!database.objectStoreNames.contains(PRESET_STORE_NAME)) {
          const store = database.createObjectStore(PRESET_STORE_NAME, {
            keyPath: ["ownerClerkUserId", "presetId"],
          });
          store.createIndex(
            PRESET_OWNER_ORDER_INDEX,
            ["ownerClerkUserId", "sortOrder"],
            { unique: false },
          );
        }
      };
      request.onsuccess = () => {
        const database = request.result;
        database.onversionchange = () => {
          database.close();
          if (this.databasePromise === promiseRef.current) {
            this.databasePromise = null;
          }
        };
        database.onclose = () => {
          if (this.databasePromise === promiseRef.current) {
            this.databasePromise = null;
          }
        };
        resolve(database);
      };
      request.onerror = () =>
        reject(
          new PresetStoreError(
            "open-failed",
            storageFailureMessage(
              "Preset storage could not be opened.",
              request.error,
            ),
            request.error,
          ),
        );
      request.onblocked = () =>
        reject(
          new PresetStoreError(
            "open-failed",
            "Preset storage upgrade is blocked by another NestCalc tab.",
          ),
        );
    });

    const activePromise = openingPromise.catch((error) => {
      if (this.databasePromise === promiseRef.current) {
        this.databasePromise = null;
      }
      throw error;
    });
    promiseRef.current = activePromise;
    this.databasePromise = activePromise;
    return this.databasePromise;
  }

  private async withTransaction<T>(
    mode: IDBTransactionMode,
    operation: (store: IDBObjectStore) => Promise<T>,
  ): Promise<T> {
    const database = await this.openDatabase();
    let transaction: IDBTransaction;
    try {
      transaction = database.transaction(PRESET_STORE_NAME, mode);
    } catch (error) {
      throw new PresetStoreError(
        "transaction-failed",
        storageFailureMessage(
          "Preset storage transaction could not start.",
          error,
        ),
        error,
      );
    }

    const completion = transactionCompletion(transaction);
    try {
      const result = await operation(transaction.objectStore(PRESET_STORE_NAME));
      await completion;
      return result;
    } catch (error) {
      try {
        transaction.abort();
      } catch {
        // The transaction may already have aborted or completed.
      }
      try {
        await completion;
      } catch {
        // Preserve the more specific operation error when one exists.
      }
      if (error instanceof PresetStoreError) throw error;
      throw new PresetStoreError(
        "transaction-failed",
        storageFailureMessage("Preset storage transaction failed.", error),
        error,
      );
    }
  }

  private async readOwnerRecords(
    store: IDBObjectStore,
    ownerClerkUserId: string,
  ): Promise<PresetRecord[]> {
    const { keyRange } = this.requireBackend();
    const records = await requestResult(
      store
        .index(PRESET_OWNER_ORDER_INDEX)
        .getAll(ownerRange(keyRange, ownerClerkUserId)),
    );
    return records as PresetRecord[];
  }

  private async requireRecord(
    store: IDBObjectStore,
    ownerClerkUserId: string,
    presetId: string,
  ): Promise<PresetRecord> {
    const record = (await requestResult(
      store.get([ownerClerkUserId, presetId]),
    )) as PresetRecord | undefined;
    if (!record) {
      throw new PresetStoreError(
        "not-found",
        "Preset was not found for the signed-in user.",
      );
    }
    return record;
  }

  private assertUniqueName(
    records: PresetRecord[],
    name: string,
    exceptPresetId?: string,
  ) {
    const foldedName = name.toLowerCase();
    if (
      records.some(
        (record) =>
          record.presetId !== exceptPresetId &&
          record.name.toLowerCase() === foldedName,
      )
    ) {
      throw new PresetStoreError(
        "duplicate-name",
        `A preset named “${name}” already exists on this device.`,
      );
    }
  }
}

export const presetStore = new PresetRepository();
