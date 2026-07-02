"use client";

import { useEffect, useRef, useState } from "react";
import { useQuickValuesFocus } from "@/hooks/useQuickValuesFocus";
import {
  finalizeNumericDraft,
  parseNumericInput,
  sanitizeNumericInput,
} from "@/lib/numericInput";

interface NumberInputProps {
  label: string;
  value: number | null;
  unit?: string;
  onChange: (value: number | null) => void;
}

function formatValue(value: number | null): string {
  if (value === null) return "—";
  return Number.isFinite(value) ? String(value) : "—";
}

export function NumberInput({ label, value, unit, onChange }: NumberInputProps) {
  const { registerActiveInput, clearActiveInput } = useQuickValuesFocus();
  const [draft, setDraft] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const display = focused && draft !== null ? draft : formatValue(value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const controllerRef = useRef({
    applyValue: (next: number) => {
      const text = String(next);
      setDraft(text);
      onChangeRef.current(next);
    },
  });

  const handleChange = (text: string) => {
    const sanitized = sanitizeNumericInput(text);
    setDraft(sanitized);
    onChange(parseNumericInput(sanitized));
  };

  return (
    <label className="flex min-w-0 flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
        {label}
      </span>
      <div className="relative w-full min-w-0">
        {unit ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-[var(--muted)]">
            {unit}
          </span>
        ) : null}
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onFocus={() => {
            setFocused(true);
            setDraft(value === null ? "" : formatValue(value));
            registerActiveInput(controllerRef.current);
          }}
          onChange={(event) => handleChange(event.target.value)}
          onBlur={() => {
            setFocused(false);
            if (draft !== null) {
              const finalized = finalizeNumericDraft(draft);
              onChange(parseNumericInput(finalized));
            }
            setDraft(null);
            clearActiveInput();
          }}
          className={`w-full min-w-0 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] py-2.5 pr-3 text-lg font-mono tabular-nums text-[var(--input-text)] outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] ${unit ? "pl-10" : "pl-3"}`}
        />
      </div>
    </label>
  );
}