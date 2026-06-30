"use client";

import { useState } from "react";
import { round3 } from "@/lib/units";

interface NumberInputProps {
  label: string;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

function formatValue(value: number): string {
  return Number.isFinite(value) ? String(value) : "0";
}

function parseInput(text: string): number {
  const trimmed = text.trim();
  if (!trimmed || trimmed === "." || trimmed === "-" || trimmed === "-.") {
    return 0;
  }
  const next = parseFloat(trimmed);
  return Number.isFinite(next) ? round3(Math.max(0, next)) : 0;
}

export function NumberInput({ label, value, unit, onChange }: NumberInputProps) {
  const [draft, setDraft] = useState<string | null>(null);
  const display = draft ?? formatValue(value);

  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onFocus={() => setDraft(formatValue(value))}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => {
            const next = parseInput(draft ?? display);
            setDraft(null);
            onChange(next);
          }}
          className="w-full min-w-0 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-3 text-lg font-mono tabular-nums text-zinc-50 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
        />
        {unit ? (
          <span className="shrink-0 text-sm font-mono text-zinc-500">{unit}</span>
        ) : null}
      </div>
    </label>
  );
}