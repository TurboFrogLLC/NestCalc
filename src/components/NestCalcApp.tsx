"use client";

import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { useNestInputs } from "@/hooks/useNestInputs";
import { useTheme } from "@/hooks/useTheme";
import {
  calculateNest,
  clearedInputs,
  nextRemRotation,
} from "@/lib/nestcalc";
import type { NestInputs, Unit } from "@/lib/types";
import { convertValue, unitLabel } from "@/lib/units";
import { NestGrid } from "./NestGrid";
import { NumberInput } from "./NumberInput";

const toggleClass =
  "min-h-11 rounded-xl border border-[var(--btn-border)] bg-[var(--btn-bg)] px-4 py-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)]";

function convertAll(inputs: NestInputs, to: Unit): NestInputs {
  const from = inputs.unit;
  const cv = (value: number | null) =>
    value === null ? null : convertValue(value, from, to);
  return {
    ...inputs,
    unit: to,
    partWidth: cv(inputs.partWidth),
    partHeight: cv(inputs.partHeight),
    remnantWidth: cv(inputs.remnantWidth),
    remnantHeight: cv(inputs.remnantHeight),
    gapX: cv(inputs.gapX),
    gapY: cv(inputs.gapY),
    margins: {
      left: cv(inputs.margins.left),
      right: cv(inputs.margins.right),
      top: cv(inputs.margins.top),
      bottom: cv(inputs.margins.bottom),
    },
  };
}

export function NestCalcApp() {
  const { inputs, setInputs } = useNestInputs();
  const { theme, toggleTheme } = useTheme();

  const result = useMemo(() => calculateNest(inputs), [inputs]);
  const unit = unitLabel(inputs.unit);

  const update = (patch: Partial<NestInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const updateMargin = (
    key: keyof NestInputs["margins"],
    value: number | null,
  ) => {
    setInputs((current) => ({
      ...current,
      margins: { ...current.margins, [key]: value },
    }));
  };

  const toggleUnit = () => {
    setInputs((current) =>
      convertAll(current, current.unit === "in" ? "mm" : "in"),
    );
  };

  const rotatePart = () => {
    setInputs((current) => ({
      ...current,
      partWidth: current.partHeight,
      partHeight: current.partWidth,
    }));
  };

  const rotateRem = () => {
    setInputs((current) => ({
      ...current,
      remRotation: nextRemRotation(current.remRotation),
    }));
  };

  const clearAll = () => {
    setInputs((current) => clearedInputs(current.unit));
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-5 pb-8">
      <header className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          NestCalc
        </h1>
        <div className="flex items-center gap-2">
          <button type="button" onClick={toggleTheme} className={toggleClass}>
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button type="button" onClick={toggleUnit} className={toggleClass}>
            {inputs.unit === "in" ? "in → mm" : "mm → in"}
          </button>
          <button
            type="button"
            onClick={clearAll}
            aria-label="Clear all fields"
            className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2 py-2 text-[var(--muted)] transition-colors hover:border-[var(--accent-hover)] hover:text-[var(--accent)]"
          >
            <RotateCcw className="h-5 w-5" strokeWidth={2} />
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3">
        <NumberInput
          label="X - [PART]"
          value={inputs.partWidth}
          unit={unit}
          onChange={(value) => update({ partWidth: value })}
        />
        <NumberInput
          label="Y - [PART]"
          value={inputs.partHeight}
          unit={unit}
          onChange={(value) => update({ partHeight: value })}
        />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <NumberInput
          label="X - [GAP]"
          value={inputs.gapX}
          unit={unit}
          onChange={(value) => update({ gapX: value })}
        />
        <NumberInput
          label="Y - [GAP]"
          value={inputs.gapY}
          unit={unit}
          onChange={(value) => update({ gapY: value })}
        />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <NumberInput
          label="X - [REM]"
          value={inputs.remnantWidth}
          unit={unit}
          onChange={(value) => update({ remnantWidth: value })}
        />
        <NumberInput
          label="Y - [REM]"
          value={inputs.remnantHeight}
          unit={unit}
          onChange={(value) => update({ remnantHeight: value })}
        />
      </section>

      <section>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
          Margins
        </p>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="Left"
            value={inputs.margins.left}
            unit={unit}
            onChange={(value) => updateMargin("left", value)}
          />
          <NumberInput
            label="Right"
            value={inputs.margins.right}
            unit={unit}
            onChange={(value) => updateMargin("right", value)}
          />
          <NumberInput
            label="Top"
            value={inputs.margins.top}
            unit={unit}
            onChange={(value) => updateMargin("top", value)}
          />
          <NumberInput
            label="Bottom"
            value={inputs.margins.bottom}
            unit={unit}
            onChange={(value) => updateMargin("bottom", value)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3">
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <p className="font-mono text-sm tabular-nums text-[var(--foreground)]">
            X{result.partsAcross} | Y{result.partsDown}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
              Total Parts
            </span>
            <span className="font-mono text-3xl font-bold tabular-nums leading-none text-[var(--accent)]">
              {result.totalParts}
            </span>
          </div>
        </div>

        <NestGrid
          remnantWidth={inputs.remnantWidth}
          remnantHeight={inputs.remnantHeight}
          partWidth={inputs.partWidth}
          partHeight={inputs.partHeight}
          margins={inputs.margins}
          gapX={inputs.gapX}
          gapY={inputs.gapY}
          remRotation={inputs.remRotation}
          result={result}
          unitLabel={unit}
        />
      </section>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={rotatePart}
          className="min-h-14 rounded-xl border border-[var(--btn-border)] bg-[var(--btn-bg)] px-3 py-3 text-sm font-semibold text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)] active:scale-[0.98]"
        >
          ↻ Rotate Part 90°
        </button>
        <button
          type="button"
          onClick={rotateRem}
          className="min-h-14 rounded-xl border border-[var(--btn-border)] bg-[var(--btn-bg)] px-3 py-3 text-sm font-semibold text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)] active:scale-[0.98]"
        >
          ↻ Rotate Rem 90°
        </button>
      </div>
    </div>
  );
}