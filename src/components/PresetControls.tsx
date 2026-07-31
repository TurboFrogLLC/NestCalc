"use client";

import {
  ChevronDown,
  ChevronUp,
  Pencil,
  Save,
  Settings2,
  Trash2,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { usePresets } from "@/hooks/usePresets";
import type { PresetRecord } from "@/lib/presetStore";
import type { NestAppState } from "@/lib/types";

const primaryButtonClass =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-[var(--accent)] bg-[var(--accent)] px-2 text-[11px] font-bold text-[var(--background)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100";

const secondaryButtonClass =
  "inline-flex h-8 shrink-0 items-center justify-center gap-1 rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2 text-[11px] font-semibold text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:text-[var(--accent)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--btn-border)] disabled:hover:text-[var(--btn-text)] disabled:active:scale-100";

const compactButtonClass =
  "inline-flex h-7 items-center justify-center gap-1 rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2 text-[10px] font-semibold text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:text-[var(--accent)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-[var(--btn-border)] disabled:hover:text-[var(--btn-text)] disabled:active:scale-100";

interface PresetControlsProps {
  currentState: NestAppState;
  onReplaceState: (state: NestAppState) => void;
}

interface ModalFrameProps {
  labelledBy: string;
  describedBy: string;
  initialFocusRef: RefObject<HTMLElement | null>;
  onCancel: () => void;
  children: ReactNode;
}

type NameDialogState =
  | { kind: "save" }
  | { kind: "rename"; presetId: string; originalName: string };

function ModalFrame({
  labelledBy,
  describedBy,
  initialFocusRef,
  onCancel,
  children,
}: ModalFrameProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    queueMicrotask(() => initialFocusRef.current?.focus());

    return () => {
      if (dialog.open && typeof dialog.close === "function") dialog.close();
    };
  }, [initialFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      onCancel={(event) => {
        event.preventDefault();
        onCancel();
      }}
      className="m-auto w-[min(24rem,calc(100vw-1.5rem))] rounded-xl border border-[var(--card-border)] bg-[var(--background)] p-0 text-[var(--foreground)] shadow-2xl backdrop:bg-black/60"
    >
      {children}
    </dialog>
  );
}

function movePresetIds(
  presets: PresetRecord[],
  index: number,
  offset: -1 | 1,
): string[] | null {
  const targetIndex = index + offset;
  if (targetIndex < 0 || targetIndex >= presets.length) return null;

  const orderedIds = presets.map((preset) => preset.presetId);
  [orderedIds[index], orderedIds[targetIndex]] = [
    orderedIds[targetIndex],
    orderedIds[index],
  ];
  return orderedIds;
}

export function PresetControls({
  currentState,
  onReplaceState,
}: PresetControlsProps) {
  const {
    presets,
    selectedPresetId,
    isAvailable,
    isLoading,
    isBusy,
    status,
    error,
    savePreset,
    saveAsNew,
    loadPreset,
    overwritePreset,
    renamePreset,
    deletePreset,
    reorderPresets,
    clearStatus,
  } = usePresets(currentState, onReplaceState);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [nameDialog, setNameDialog] = useState<NameDialogState | null>(null);
  const [nameValue, setNameValue] = useState("");
  const [showNameValidation, setShowNameValidation] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<PresetRecord | null>(null);
  const helperId = useId();
  const storageDescriptionId = useId();
  const statusId = useId();
  const sheetId = useId();
  const sheetTitleId = useId();
  const nameTitleId = useId();
  const nameDescriptionId = useId();
  const nameErrorId = useId();
  const deleteTitleId = useId();
  const deleteDescriptionId = useId();
  const saveButtonRef = useRef<HTMLButtonElement>(null);
  const manageButtonRef = useRef<HTMLButtonElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const deleteCancelRef = useRef<HTMLButtonElement>(null);
  const controlsDisabled = !isAvailable || isLoading || isBusy;
  const trimmedName = nameValue.trim();
  const nameLength = Array.from(trimmedName).length;
  const localNameError =
    nameLength === 0
      ? "Enter a preset name."
      : nameLength > 64
        ? "Preset names must be 64 Unicode characters or fewer."
        : null;

  useEffect(() => {
    if (isSheetOpen && isAvailable) sheetCloseRef.current?.focus();
  }, [isAvailable, isSheetOpen]);

  useEffect(() => {
    if (isAvailable) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setIsSheetOpen(false);
      setNameDialog(null);
      setDeleteTarget(null);
    });

    return () => {
      cancelled = true;
    };
  }, [isAvailable]);

  const openSaveDialog = (source: "rail" | "sheet") => {
    clearStatus();
    setNameValue("");
    setShowNameValidation(false);
    setNameDialog({ kind: "save" });
    if (source === "rail") saveButtonRef.current?.focus();
  };

  const openRenameDialog = (preset: PresetRecord) => {
    clearStatus();
    setNameValue(preset.name);
    setShowNameValidation(false);
    setNameDialog({
      kind: "rename",
      presetId: preset.presetId,
      originalName: preset.name,
    });
  };

  const closeNameDialog = () => {
    if (isBusy) return;
    const returnToSheet = nameDialog?.kind === "rename" || isSheetOpen;
    setNameDialog(null);
    queueMicrotask(() =>
      (returnToSheet ? sheetCloseRef : saveButtonRef).current?.focus(),
    );
  };

  const handleNameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nameDialog || localNameError) {
      setShowNameValidation(true);
      return;
    }

    const succeeded =
      nameDialog.kind === "save"
        ? await (isSheetOpen ? saveAsNew(trimmedName) : savePreset(trimmedName))
        : await renamePreset(nameDialog.presetId, trimmedName);

    if (succeeded) closeNameDialog();
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
    queueMicrotask(() => manageButtonRef.current?.focus());
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const succeeded = await deletePreset(deleteTarget.presetId);
    if (succeeded) {
      setDeleteTarget(null);
      queueMicrotask(() => sheetCloseRef.current?.focus());
    }
  };

  const reorder = (index: number, offset: -1 | 1) => {
    const orderedIds = movePresetIds(presets, index, offset);
    if (orderedIds) void reorderPresets(orderedIds);
  };

  return (
    <section
      aria-label="Named presets"
      aria-describedby={`${helperId} ${storageDescriptionId}`}
      aria-busy={isLoading || isBusy}
      className="relative flex shrink-0 flex-col gap-1 rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-2 py-1.5"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <div
          role="list"
          aria-label="Saved preset chips"
          className="flex min-w-0 flex-1 snap-x items-center gap-1 overflow-x-auto overscroll-x-contain whitespace-nowrap py-0.5"
        >
          {isLoading ? (
            <span className="px-1 text-[11px] text-[var(--muted)]">
              Loading presets…
            </span>
          ) : presets.length === 0 ? (
            <span className="px-1 text-[11px] text-[var(--muted)]">
              {isAvailable ? "No saved presets" : "Sign in for presets"}
            </span>
          ) : (
            presets.map((preset) => {
              const isSelected = selectedPresetId === preset.presetId;
              return (
                <span
                  key={preset.presetId}
                  role="listitem"
                  className="shrink-0 snap-start"
                >
                  <button
                    type="button"
                    aria-label={`Load preset ${preset.name}`}
                    aria-pressed={isSelected}
                    disabled={controlsDisabled}
                    onClick={() => void loadPreset(preset.presetId)}
                    className={`h-7 max-w-40 truncate rounded-full border px-2.5 text-[11px] font-semibold transition-colors active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 ${
                      isSelected
                        ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)]"
                        : "border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--btn-text)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)]"
                    }`}
                  >
                    {preset.name}
                  </button>
                </span>
              );
            })
          )}
        </div>

        <button
          ref={saveButtonRef}
          type="button"
          disabled={controlsDisabled}
          onClick={() => openSaveDialog("rail")}
          className={primaryButtonClass}
        >
          <Save aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
          Save Preset
        </button>
        <button
          ref={manageButtonRef}
          type="button"
          aria-expanded={isSheetOpen}
          aria-controls={sheetId}
          disabled={controlsDisabled}
          onClick={() => setIsSheetOpen((open) => !open)}
          className={secondaryButtonClass}
        >
          <Settings2 aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
          Manage
        </button>
      </div>

      <p
        id={helperId}
        className="text-[10px] font-medium leading-tight text-[var(--muted)]"
      >
        Saved on this device only
      </p>
      <p id={storageDescriptionId} className="sr-only">
        Presets are kept in this browser or installed-app storage container.
        Clerk identifies the owner but does not synchronize presets.
      </p>
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        className="min-h-3 text-[10px] leading-tight text-[var(--muted)]"
      >
        {error ? "" : status}
      </p>
      {error ? (
        <p role="alert" className="text-[10px] leading-tight text-red-400">
          {error}
        </p>
      ) : null}

      {isSheetOpen && isAvailable ? (
        <aside
          id={sheetId}
          aria-labelledby={sheetTitleId}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !nameDialog && !deleteTarget) {
              event.preventDefault();
              closeSheet();
            }
          }}
          className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[calc(env(safe-area-inset-top,0px)+6.75rem)] z-40 flex w-[min(25rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--background)] shadow-2xl"
        >
          <div className="flex shrink-0 items-center gap-2 border-b border-[var(--card-border)] px-3 py-2">
            <div className="min-w-0 flex-1">
              <h2 id={sheetTitleId} className="text-sm font-bold">
                Manage Presets
              </h2>
              <p className="text-[10px] text-[var(--muted)]">
                This browser or installed-app storage container
              </p>
            </div>
            <button
              type="button"
              disabled={controlsDisabled}
              onClick={() => openSaveDialog("sheet")}
              className={primaryButtonClass}
            >
              <Save aria-hidden="true" className="h-3 w-3" strokeWidth={2} />
              Save As New
            </button>
            <button
              ref={sheetCloseRef}
              type="button"
              aria-label="Close preset manager"
              title="Close"
              onClick={closeSheet}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--muted)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)]"
            >
              <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          <div className="shrink-0 border-b border-[var(--card-border)] px-3 py-1.5">
            <p
              role="status"
              aria-live="polite"
              className="min-h-3 text-[10px] leading-tight text-[var(--muted)]"
            >
              {error ? "" : status}
            </p>
            {error ? (
              <p role="alert" className="text-[10px] leading-tight text-red-400">
                {error}
              </p>
            ) : null}
          </div>

          <div className="min-h-0 overflow-y-auto overscroll-contain p-2">
            {presets.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[var(--card-border)] px-3 py-5 text-center text-xs text-[var(--muted)]">
                No presets saved on this device.
              </p>
            ) : (
              <ol aria-label="Preset order" className="flex flex-col gap-2">
                {presets.map((preset, index) => {
                  const isSelected = selectedPresetId === preset.presetId;
                  return (
                    <li
                      key={preset.presetId}
                      className={`rounded-lg border p-2 ${
                        isSelected
                          ? "border-[var(--accent)] bg-[var(--card)]"
                          : "border-[var(--card-border)] bg-[var(--card)]"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          aria-label={`Load preset ${preset.name}`}
                          aria-pressed={isSelected}
                          disabled={controlsDisabled}
                          onClick={() => void loadPreset(preset.presetId)}
                          className="min-w-0 flex-1 truncate rounded-md px-1 py-1 text-left text-xs font-bold text-[var(--foreground)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {preset.name}
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${preset.name} up`}
                          title="Move up"
                          disabled={controlsDisabled || index === 0}
                          onClick={() => reorder(index, -1)}
                          className={compactButtonClass}
                        >
                          <ChevronUp
                            aria-hidden="true"
                            className="h-3 w-3"
                            strokeWidth={2}
                          />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${preset.name} down`}
                          title="Move down"
                          disabled={
                            controlsDisabled || index === presets.length - 1
                          }
                          onClick={() => reorder(index, 1)}
                          className={compactButtonClass}
                        >
                          <ChevronDown
                            aria-hidden="true"
                            className="h-3 w-3"
                            strokeWidth={2}
                          />
                        </button>
                      </div>
                      <div className="mt-1.5 grid grid-cols-3 gap-1">
                        <button
                          type="button"
                          disabled={controlsDisabled}
                          onClick={() =>
                            void overwritePreset(preset.presetId)
                          }
                          className={compactButtonClass}
                        >
                          <Save
                            aria-hidden="true"
                            className="h-3 w-3"
                            strokeWidth={2}
                          />
                          Overwrite
                        </button>
                        <button
                          type="button"
                          disabled={controlsDisabled}
                          onClick={() => openRenameDialog(preset)}
                          className={compactButtonClass}
                        >
                          <Pencil
                            aria-hidden="true"
                            className="h-3 w-3"
                            strokeWidth={2}
                          />
                          Rename
                        </button>
                        <button
                          type="button"
                          disabled={controlsDisabled}
                          onClick={() => {
                            clearStatus();
                            setDeleteTarget(preset);
                          }}
                          className={`${compactButtonClass} hover:border-red-400 hover:text-red-400`}
                        >
                          <Trash2
                            aria-hidden="true"
                            className="h-3 w-3"
                            strokeWidth={2}
                          />
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </div>
        </aside>
      ) : null}

      {nameDialog && isAvailable ? (
        <ModalFrame
          labelledBy={nameTitleId}
          describedBy={`${nameDescriptionId}${showNameValidation && localNameError ? ` ${nameErrorId}` : ""}`}
          initialFocusRef={nameInputRef}
          onCancel={closeNameDialog}
        >
          <form onSubmit={(event) => void handleNameSubmit(event)}>
            <div className="flex items-center gap-2 border-b border-[var(--card-border)] px-4 py-3">
              <h2 id={nameTitleId} className="min-w-0 flex-1 text-sm font-bold">
                {nameDialog.kind === "save" ? "Save Preset" : "Rename Preset"}
              </h2>
              <button
                type="button"
                aria-label="Close preset name dialog"
                disabled={isBusy}
                onClick={closeNameDialog}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--muted)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)] disabled:opacity-40"
              >
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
            <div className="flex flex-col gap-3 px-4 py-3">
              <p id={nameDescriptionId} className="text-xs text-[var(--muted)]">
                {nameDialog.kind === "save"
                  ? "Name this full NestCalc state snapshot."
                  : `Choose a new name for “${nameDialog.originalName}”.`}
              </p>
              <label className="flex flex-col gap-1 text-xs font-semibold">
                Preset name
                <input
                  ref={nameInputRef}
                  type="text"
                  value={nameValue}
                  aria-invalid={Boolean(
                    (showNameValidation && localNameError) || error,
                  )}
                  aria-describedby={
                    (showNameValidation && localNameError) || error
                      ? nameErrorId
                      : undefined
                  }
                  disabled={isBusy}
                  onChange={(event) => {
                    setNameValue(event.target.value);
                    setShowNameValidation(false);
                    clearStatus();
                  }}
                  className="h-10 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)] outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50"
                />
              </label>
              <div className="flex min-h-4 items-start justify-between gap-2 text-[10px]">
                <span
                  id={nameErrorId}
                  role={
                    (showNameValidation && localNameError) || error
                      ? "alert"
                      : undefined
                  }
                  className="text-red-400"
                >
                  {showNameValidation ? localNameError : error}
                </span>
                <span className="ml-auto shrink-0 text-[var(--muted)]">
                  {nameLength}/64
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--card-border)] px-4 py-3">
              <button
                type="button"
                disabled={isBusy}
                onClick={closeNameDialog}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isBusy}
                className={primaryButtonClass}
              >
                {isBusy
                  ? "Saving…"
                  : nameDialog.kind === "save"
                    ? "Save Preset"
                    : "Rename Preset"}
              </button>
            </div>
          </form>
        </ModalFrame>
      ) : null}

      {deleteTarget && isAvailable ? (
        <ModalFrame
          labelledBy={deleteTitleId}
          describedBy={deleteDescriptionId}
          initialFocusRef={deleteCancelRef}
          onCancel={() => {
            if (!isBusy) setDeleteTarget(null);
          }}
        >
          <div className="flex flex-col gap-3 p-4">
            <h2 id={deleteTitleId} className="text-sm font-bold">
              Delete preset?
            </h2>
            <p id={deleteDescriptionId} className="text-xs text-[var(--muted)]">
              Delete “{deleteTarget.name}” from this device? This cannot be
              undone.
            </p>
            {error ? (
              <p role="alert" className="text-xs text-red-400">
                {error}
              </p>
            ) : null}
            <div className="flex justify-end gap-2">
              <button
                ref={deleteCancelRef}
                type="button"
                disabled={isBusy}
                onClick={() => setDeleteTarget(null)}
                className={secondaryButtonClass}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isBusy}
                onClick={() => void confirmDelete()}
                className="inline-flex h-8 items-center justify-center gap-1 rounded-md border border-red-500 bg-red-600 px-3 text-[11px] font-bold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2
                  aria-hidden="true"
                  className="h-3 w-3"
                  strokeWidth={2}
                />
                {isBusy ? "Deleting…" : "Confirm Delete"}
              </button>
            </div>
          </div>
        </ModalFrame>
      ) : null}
    </section>
  );
}
