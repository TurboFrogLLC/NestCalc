"use client";

import { round3 } from "@/lib/units";

interface NumberInputProps {
  label: string;
  value: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function NumberInput({ label, value, unit, onChange }: NumberInputProps) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <input
          type="number"
          inputMode="decimal"
          step="0.001"
          min="0"
          value={Number.isFinite(value) ? value : 0}
          onChange={(event) => {
            const next = parseFloat(event.target.value);
            onChange(Number.isFinite(next) ? round3(next) : 0);
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