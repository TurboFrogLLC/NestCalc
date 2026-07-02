"use client";

import { useSyncExternalStore } from "react";
import { QUICK_VALUES } from "@/lib/numericInput";
import { useQuickValuesFocus } from "@/hooks/useQuickValuesFocus";

function formatPreset(value: number): string {
  return value.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");
}

function subscribeViewport(onStoreChange: () => void) {
  const viewport = window.visualViewport;
  viewport?.addEventListener("resize", onStoreChange);
  viewport?.addEventListener("scroll", onStoreChange);
  window.addEventListener("resize", onStoreChange);
  return () => {
    viewport?.removeEventListener("resize", onStoreChange);
    viewport?.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getViewportTop() {
  const viewport = window.visualViewport;
  return viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
}

export function QuickValuesBar() {
  const { activeInput } = useQuickValuesFocus();
  const barTop = useSyncExternalStore(
    subscribeViewport,
    getViewportTop,
    () => 0,
  );

  if (!activeInput) return null;

  return (
    <div
      className="fixed inset-x-0 z-50 border-t border-[var(--card-border)] bg-[var(--card)] px-2 py-1.5 shadow-[0_-2px_8px_rgba(0,0,0,0.12)]"
      style={{ top: barTop, transform: "translateY(-100%)" }}
      role="toolbar"
      aria-label="Quick values"
    >
      <div className="mx-auto flex max-w-lg items-center justify-between gap-1">
        {QUICK_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => activeInput.applyValue(value)}
            className="min-h-9 flex-1 rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] px-1 py-1.5 font-mono text-xs font-semibold tabular-nums text-[var(--accent)] transition-colors active:scale-[0.97] hover:border-[var(--accent-hover)] hover:bg-[var(--preview-bg)]"
          >
            {formatPreset(value)}
          </button>
        ))}
      </div>
    </div>
  );
}