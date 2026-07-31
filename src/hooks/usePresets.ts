"use client";

import { useAuth } from "@clerk/nextjs";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  PresetStoreError,
  presetStore,
  type PresetRecord,
} from "@/lib/presetStore";
import type { NestAppState } from "@/lib/types";

type ReplaceNestAppState = (state: NestAppState) => void;

interface PendingOperation {
  ownerId: string;
  authGeneration: number;
  operationId: number;
}

function operationMatches(
  operation: PendingOperation | null,
  ownerId: string,
  authGeneration: number,
): boolean {
  return (
    operation?.ownerId === ownerId &&
    operation.authGeneration === authGeneration
  );
}

export interface UsePresetsResult {
  presets: PresetRecord[];
  selectedPresetId: string | null;
  isAuthLoaded: boolean;
  isAvailable: boolean;
  isLoading: boolean;
  isBusy: boolean;
  status: string;
  error: string | null;
  refresh: () => Promise<boolean>;
  savePreset: (name: string) => Promise<boolean>;
  saveAsNew: (name: string) => Promise<boolean>;
  loadPreset: (presetId: string) => Promise<boolean>;
  overwritePreset: (presetId: string) => Promise<boolean>;
  renamePreset: (presetId: string, name: string) => Promise<boolean>;
  deletePreset: (presetId: string) => Promise<boolean>;
  reorderPresets: (orderedPresetIds: string[]) => Promise<boolean>;
  clearStatus: () => void;
}

function presetErrorMessage(error: unknown): string {
  if (error instanceof PresetStoreError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Preset storage failed. Try again or check this device's storage settings.";
}

export function usePresets(
  currentState: NestAppState,
  replaceState: ReplaceNestAppState,
): UsePresetsResult {
  const { isLoaded, userId } = useAuth();
  const [records, setRecords] = useState<PresetRecord[]>([]);
  const [recordsOwnerId, setRecordsOwnerId] = useState<string | null>(null);
  const [recordsAuthGeneration, setRecordsAuthGeneration] = useState(-1);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [loadingOperation, setLoadingOperation] =
    useState<PendingOperation | null>(null);
  const [busyOperation, setBusyOperation] =
    useState<PendingOperation | null>(null);
  const [messageOwnerId, setMessageOwnerId] = useState<string | null>(null);
  const [messageAuthGeneration, setMessageAuthGeneration] = useState(-1);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [renderAuthGeneration, setRenderAuthGeneration] = useState(0);
  const ownerRef = useRef(userId);
  const requestRef = useRef(0);
  const operationIdRef = useRef(0);
  const loadingOperationRef = useRef<PendingOperation | null>(null);
  const busyOperationRef = useRef<PendingOperation | null>(null);

  const ownerStillActive = useCallback(
    (ownerId: string, authGeneration: number) =>
      isLoaded &&
      ownerRef.current === ownerId &&
      requestRef.current === authGeneration,
    [isLoaded],
  );

  useLayoutEffect(() => {
    ownerRef.current = userId;
    requestRef.current += 1;
    const authGeneration = requestRef.current;
    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled && requestRef.current === authGeneration) {
        setRenderAuthGeneration(authGeneration);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, userId]);

  useEffect(() => {
    const requestId = requestRef.current;

    if (!isLoaded || !userId) return;

    void Promise.resolve().then(async () => {
      if (requestRef.current !== requestId || ownerRef.current !== userId) {
        return;
      }

      const operation = {
        ownerId: userId,
        authGeneration: requestId,
        operationId: ++operationIdRef.current,
      };
      loadingOperationRef.current = operation;
      setLoadingOperation(operation);
      setMessageOwnerId(userId);
      setMessageAuthGeneration(requestId);
      setStatus("Loading saved presets…");
      setError(null);

      try {
        const nextRecords = await presetStore.listPresets(userId);
        if (requestRef.current !== requestId || ownerRef.current !== userId) {
          return;
        }

        setRecords(nextRecords);
        setRecordsOwnerId(userId);
        setRecordsAuthGeneration(requestId);
        setSelectedPresetId(null);
        setStatus(
          nextRecords.length === 0
            ? "No presets saved on this device."
            : `${nextRecords.length} saved preset${nextRecords.length === 1 ? "" : "s"} loaded.`,
        );
      } catch (caught: unknown) {
        if (requestRef.current !== requestId || ownerRef.current !== userId) {
          return;
        }

        setRecords([]);
        setRecordsOwnerId(userId);
        setRecordsAuthGeneration(requestId);
        setSelectedPresetId(null);
        setStatus("");
        setError(presetErrorMessage(caught));
      } finally {
        if (
          loadingOperationRef.current?.operationId === operation.operationId
        ) {
          loadingOperationRef.current = null;
        }
        setLoadingOperation((current) =>
          current?.operationId === operation.operationId ? null : current,
        );
      }
    });
  }, [isLoaded, userId]);

  const clearStatus = useCallback(() => {
    setMessageOwnerId(ownerRef.current ?? null);
    setMessageAuthGeneration(requestRef.current);
    setStatus("");
    setError(null);
  }, []);

  const refresh = useCallback(async (): Promise<boolean> => {
    const ownerId = ownerRef.current;
    const authGeneration = requestRef.current;
    if (
      !isLoaded ||
      !ownerId ||
      operationMatches(busyOperationRef.current, ownerId, authGeneration) ||
      operationMatches(loadingOperationRef.current, ownerId, authGeneration)
    ) {
      return false;
    }

    const operation = {
      ownerId,
      authGeneration,
      operationId: ++operationIdRef.current,
    };
    loadingOperationRef.current = operation;
    setLoadingOperation(operation);
    setMessageOwnerId(ownerId);
    setMessageAuthGeneration(authGeneration);
    setStatus("Refreshing saved presets…");
    setError(null);

    try {
      const nextRecords = await presetStore.listPresets(ownerId);
      if (!ownerStillActive(ownerId, authGeneration)) return false;

      setRecords(nextRecords);
      setRecordsOwnerId(ownerId);
      setRecordsAuthGeneration(authGeneration);
      setStatus(
        nextRecords.length === 0
          ? "No presets saved on this device."
          : `${nextRecords.length} saved preset${nextRecords.length === 1 ? "" : "s"} loaded.`,
      );
      return true;
    } catch (caught: unknown) {
      if (!ownerStillActive(ownerId, authGeneration)) return false;
      setStatus("");
      setError(presetErrorMessage(caught));
      return false;
    } finally {
      if (
        loadingOperationRef.current?.operationId === operation.operationId
      ) {
        loadingOperationRef.current = null;
      }
      setLoadingOperation((current) =>
        current?.operationId === operation.operationId ? null : current,
      );
    }
  }, [isLoaded, ownerStillActive]);

  const mutateAndRefresh = useCallback(
    async (
      pendingMessage: string,
      successMessage: string,
      mutation: (ownerId: string) => Promise<string | null | undefined>,
    ): Promise<boolean> => {
      const ownerId = ownerRef.current;
      const authGeneration = requestRef.current;
      if (
        !isLoaded ||
        !ownerId ||
        operationMatches(busyOperationRef.current, ownerId, authGeneration) ||
        operationMatches(
          loadingOperationRef.current,
          ownerId,
          authGeneration,
        ) ||
        recordsOwnerId !== ownerId ||
        recordsAuthGeneration !== authGeneration
      ) {
        return false;
      }

      const operation = {
        ownerId,
        authGeneration,
        operationId: ++operationIdRef.current,
      };
      busyOperationRef.current = operation;
      setBusyOperation(operation);
      setMessageOwnerId(ownerId);
      setMessageAuthGeneration(authGeneration);
      setStatus(pendingMessage);
      setError(null);

      try {
        const nextSelection = await mutation(ownerId);
        const nextRecords = await presetStore.listPresets(ownerId);
        if (!ownerStillActive(ownerId, authGeneration)) return false;

        setRecords(nextRecords);
        setRecordsOwnerId(ownerId);
        setRecordsAuthGeneration(authGeneration);
        if (nextSelection !== undefined) setSelectedPresetId(nextSelection);
        setStatus(successMessage);
        return true;
      } catch (caught: unknown) {
        if (!ownerStillActive(ownerId, authGeneration)) return false;
        setStatus("");
        setError(presetErrorMessage(caught));
        return false;
      } finally {
        if (busyOperationRef.current?.operationId === operation.operationId) {
          busyOperationRef.current = null;
        }
        setBusyOperation((current) =>
          current?.operationId === operation.operationId ? null : current,
        );
      }
    },
    [isLoaded, ownerStillActive, recordsAuthGeneration, recordsOwnerId],
  );

  const savePreset = useCallback(
    (name: string) =>
      mutateAndRefresh(
        "Saving preset…",
        `Preset “${name.trim()}” saved.`,
        async (ownerId) => {
          const created = await presetStore.createPreset(
            ownerId,
            name,
            currentState,
          );
          return created.presetId;
        },
      ),
    [currentState, mutateAndRefresh],
  );

  const loadPreset = useCallback(
    async (presetId: string): Promise<boolean> => {
      const ownerId = ownerRef.current;
      const authGeneration = requestRef.current;
      if (
        !isLoaded ||
        !ownerId ||
        operationMatches(busyOperationRef.current, ownerId, authGeneration) ||
        operationMatches(
          loadingOperationRef.current,
          ownerId,
          authGeneration,
        ) ||
        recordsOwnerId !== ownerId ||
        recordsAuthGeneration !== authGeneration
      ) {
        return false;
      }

      const operation = {
        ownerId,
        authGeneration,
        operationId: ++operationIdRef.current,
      };
      busyOperationRef.current = operation;
      setBusyOperation(operation);
      setMessageOwnerId(ownerId);
      setMessageAuthGeneration(authGeneration);
      setStatus("Loading preset…");
      setError(null);

      try {
        const snapshot = await presetStore.loadPreset(ownerId, presetId);
        if (!ownerStillActive(ownerId, authGeneration)) return false;

        replaceState(snapshot);
        setSelectedPresetId(presetId);
        const loadedName = records.find(
          (record) => record.presetId === presetId,
        )?.name;
        setStatus(
          loadedName ? `Preset “${loadedName}” loaded.` : "Preset loaded.",
        );
        return true;
      } catch (caught: unknown) {
        if (!ownerStillActive(ownerId, authGeneration)) return false;
        setStatus("");
        setError(presetErrorMessage(caught));
        return false;
      } finally {
        if (busyOperationRef.current?.operationId === operation.operationId) {
          busyOperationRef.current = null;
        }
        setBusyOperation((current) =>
          current?.operationId === operation.operationId ? null : current,
        );
      }
    },
    [
      isLoaded,
      ownerStillActive,
      records,
      recordsAuthGeneration,
      recordsOwnerId,
      replaceState,
    ],
  );

  const overwritePreset = useCallback(
    (presetId: string) => {
      const presetName = records.find(
        (record) => record.presetId === presetId,
      )?.name;

      return mutateAndRefresh(
        "Overwriting preset…",
        presetName ? `Preset “${presetName}” overwritten.` : "Preset overwritten.",
        async (ownerId) => {
          await presetStore.overwritePreset(ownerId, presetId, currentState);
          return presetId;
        },
      );
    },
    [currentState, mutateAndRefresh, records],
  );

  const renamePreset = useCallback(
    (presetId: string, name: string) =>
      mutateAndRefresh(
        "Renaming preset…",
        `Preset renamed to “${name.trim()}”.`,
        async (ownerId) => {
          await presetStore.renamePreset(ownerId, presetId, name);
          return presetId;
        },
      ),
    [mutateAndRefresh],
  );

  const deletePreset = useCallback(
    (presetId: string) => {
      const presetName = records.find(
        (record) => record.presetId === presetId,
      )?.name;
      const clearSelection = selectedPresetId === presetId;

      return mutateAndRefresh(
        "Deleting preset…",
        presetName ? `Preset “${presetName}” deleted.` : "Preset deleted.",
        async (ownerId) => {
          await presetStore.deletePreset(ownerId, presetId);
          return clearSelection ? null : undefined;
        },
      );
    },
    [mutateAndRefresh, records, selectedPresetId],
  );

  const reorderPresets = useCallback(
    (orderedPresetIds: string[]) =>
      mutateAndRefresh(
        "Reordering presets…",
        "Preset order saved.",
        async (ownerId) => {
          await presetStore.reorderPresets(ownerId, orderedPresetIds);
          return undefined;
        },
      ),
    [mutateAndRefresh],
  );

  const currentAuthGeneration = renderAuthGeneration;
  const recordsAreCurrent =
    isLoaded &&
    Boolean(userId) &&
    recordsOwnerId === userId &&
    recordsAuthGeneration === currentAuthGeneration;
  const visiblePresets = recordsAreCurrent ? records : [];
  const visibleSelectedPresetId =
    recordsAreCurrent ? selectedPresetId : null;
  const isAvailable = Boolean(isLoaded && userId);
  const isLoading =
    !isLoaded ||
    (Boolean(userId) &&
      (!recordsAreCurrent ||
        operationMatches(
          loadingOperation,
          userId as string,
          currentAuthGeneration,
        )));
  const isBusy = Boolean(
    userId && operationMatches(busyOperation, userId, currentAuthGeneration),
  );
  const messageIsCurrent =
    messageOwnerId === userId &&
    messageAuthGeneration === currentAuthGeneration;
  const visibleStatus = messageIsCurrent ? status : "";
  const visibleError = messageIsCurrent ? error : null;
  const availabilityStatus = !isLoaded
    ? "Loading saved presets…"
    : !userId
      ? "Sign in to use presets."
      : visibleStatus;

  return {
    presets: visiblePresets,
    selectedPresetId: visibleSelectedPresetId,
    isAuthLoaded: isLoaded,
    isAvailable,
    isLoading,
    isBusy,
    status: visibleError ? "" : availabilityStatus,
    error: visibleError,
    refresh,
    savePreset,
    saveAsNew: savePreset,
    loadPreset,
    overwritePreset,
    renamePreset,
    deletePreset,
    reorderPresets,
    clearStatus,
  };
}
