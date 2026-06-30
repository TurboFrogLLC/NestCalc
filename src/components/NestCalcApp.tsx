"use client";

import {
  ArrowLeftRight,
  Link2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNestInputs } from "@/hooks/useNestInputs";
import { calculateNest, rotateMarginsCW } from "@/lib/nestcalc";
import { EMPTY_INPUTS, loadTheme, saveTheme } from "@/lib/storage";
import type { NestInputs, Theme, Unit } from "@/lib/types";
import { convertValue, unitLabel } from "@/lib/units";
import { NestGrid } from "./NestGrid";
import { NumberInput } from "./NumberInput";

function convertNullable(
  value: number | null,
  from: Unit,
  to: Unit,
): number | null {
  if (value === null) return null;
  return convertValue(value, from, to);
}

function convertAll(inputs: NestInputs, to: Unit): NestInputs {
  const from = inputs.unit;
  const cv = (value: number | null) => convertNullable(value, from, to);
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

function linkValues(
  x: number | null,
  y: number | null,
): { x: number | null; y: number | null } {
  if (x === null && y === null) return { x: null, y: null };
  if (x === null) return { x: y, y };
  if (y === null) return { x, y: x };
  return { x, y: x };
}

function swapValues(
  x: number | null,
  y: number | null,
): { x: number | null; y: number | null } {
  return { x: y, y: x };
}

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  compact?: boolean;
}

function IconButton({ label, onClick, children, compact }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`btn-icon flex shrink-0 items-center justify-center rounded-lg border transition-colors active:scale-[0.97] ${
        compact ? "h-10 w-10" : "h-[50px] w-10"
      }`}
    >
      {children}
    </button>
  );
}

interface SummaryLineProps {
  partsAcross: number;
  partsDown: number;
  totalParts: number;
  prominent?: boolean;
}

function SummaryLine({
  partsAcross,
  partsDown,
  totalParts,
  prominent,
}: SummaryLineProps) {
  return (
    <>
      <span
        className={`font-mono tabular-nums text-foreground ${
          prominent ? "text-base font-bold" : "text-sm font-semibold"
        }`}
      >
        X{partsAcross} | Y{partsDown}
      </span>
      <span
        className={`font-mono tabular-nums ${
          prominent ? "text-sm" : "text-xs"
        } text-muted`}
      >
        Total Parts{" "}
        <span
          className={`font-bold text-accent ${
            prominent ? "text-3xl" : "text-2xl"
          }`}
        >
          {totalParts}
        </span>
      </span>
    </>
  );
}

interface XYInputRowProps {
  xLabel: string;
  yLabel: string;
  xValue: number | null;
  yValue: number | null;
  unit: string;
  onXChange: (value: number | null) => void;
  onYChange: (value: number | null) => void;
  onLink: () => void;
  onSwap: () => void;
}

function XYInputRow({
  xLabel,
  yLabel,
  xValue,
  yValue,
  unit,
  onXChange,
  onYChange,
  onLink,
  onSwap,
}: XYInputRowProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="min-w-0 flex-1">
        <NumberInput
          label={xLabel}
          value={xValue}
          unit={unit}
          onChange={onXChange}
        />
      </div>
      <div className="flex shrink-0 items-end gap-1 pb-[1px]">
        <IconButton label="Link X and Y" onClick={onLink}>
          <Link2 className="h-4 w-4" strokeWidth={2} />
        </IconButton>
        <IconButton label="Swap X and Y" onClick={onSwap}>
          <ArrowLeftRight className="h-4 w-4" strokeWidth={2} />
        </IconButton>
      </div>
      <div className="min-w-0 flex-1">
        <NumberInput
          label={yLabel}
          value={yValue}
          unit={unit}
          onChange={onYChange}
        />
      </div>
    </div>
  );
}

export function NestCalcApp() {
  const { inputs, setInputs } = useNestInputs();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    return loadTheme();
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

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

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    saveTheme(next);
    document.documentElement.dataset.theme = next;
  };

  const toggleUnit = () => {
    setInputs((current) =>
      convertAll(current, current.unit === "in" ? "mm" : "in"),
    );
  };

  const clearAll = () => {
    setInputs((current) => ({
      ...EMPTY_INPUTS,
      unit: current.unit,
      moveMarginsWithRotation: false,
    }));
  };

  const rotatePart = () => {
    setInputs((current) => ({
      ...current,
      partWidth: current.partHeight,
      partHeight: current.partWidth,
    }));
  };

  const rotateRemnant = () => {
    setInputs((current) => ({
      ...current,
      remnantWidth: current.remnantHeight,
      remnantHeight: current.remnantWidth,
      gapX: current.gapY,
      gapY: current.gapX,
      margins: current.moveMarginsWithRotation
        ? rotateMarginsCW(current.margins)
        : current.margins,
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-5 pb-8">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">NestCalc</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-secondary min-h-10 rounded-xl border px-3 py-2 text-sm font-semibold text-accent transition-colors"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            type="button"
            onClick={toggleUnit}
            className="btn-secondary min-h-10 rounded-xl border px-3 py-2 text-sm font-semibold text-accent transition-colors"
          >
            {inputs.unit === "in" ? "in → mm" : "mm → in"}
          </button>
          <IconButton label="Clear all fields" onClick={clearAll} compact>
            <RotateCcw className="h-4 w-4" strokeWidth={2} />
          </IconButton>
        </div>
      </header>

      <section className="flex h-[50px] items-center justify-between rounded-lg border border-card bg-card px-3">
        <SummaryLine
          partsAcross={result.partsAcross}
          partsDown={result.partsDown}
          totalParts={result.totalParts}
          prominent
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Part
        </p>
        <XYInputRow
          xLabel="X [PART]"
          yLabel="Y [PART]"
          xValue={inputs.partWidth}
          yValue={inputs.partHeight}
          unit={unit}
          onXChange={(value) => update({ partWidth: value })}
          onYChange={(value) => update({ partHeight: value })}
          onLink={() => {
            const linked = linkValues(inputs.partWidth, inputs.partHeight);
            update({ partWidth: linked.x, partHeight: linked.y });
          }}
          onSwap={() => {
            const swapped = swapValues(inputs.partWidth, inputs.partHeight);
            update({ partWidth: swapped.x, partHeight: swapped.y });
          }}
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Gap
        </p>
        <XYInputRow
          xLabel="X [GAP]"
          yLabel="Y [GAP]"
          xValue={inputs.gapX}
          yValue={inputs.gapY}
          unit={unit}
          onXChange={(value) => update({ gapX: value })}
          onYChange={(value) => update({ gapY: value })}
          onLink={() => {
            const linked = linkValues(inputs.gapX, inputs.gapY);
            update({ gapX: linked.x, gapY: linked.y });
          }}
          onSwap={() => {
            const swapped = swapValues(inputs.gapX, inputs.gapY);
            update({ gapX: swapped.x, gapY: swapped.y });
          }}
        />
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Rem
        </p>
        <div className="grid grid-cols-2 gap-3">
          <NumberInput
            label="X [REM]"
            value={inputs.remnantWidth}
            unit={unit}
            onChange={(value) => update({ remnantWidth: value })}
          />
          <NumberInput
            label="Y [REM]"
            value={inputs.remnantHeight}
            unit={unit}
            onChange={(value) => update({ remnantHeight: value })}
          />
        </div>
      </section>

      <section>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
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
        <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={inputs.moveMarginsWithRotation}
            onChange={(event) =>
              update({ moveMarginsWithRotation: event.target.checked })
            }
            className="h-4 w-4 rounded border-[var(--input-border)] accent-[var(--accent)]"
          />
          Move margins with rotation
        </label>
      </section>

      <section className="rounded-2xl border border-card bg-card p-3">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-sm font-semibold tabular-nums">
            X{result.partsAcross} | Y{result.partsDown}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={rotatePart}
              className="btn-secondary flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" strokeWidth={2} />
              Part 90°
            </button>
            <button
              type="button"
              onClick={rotateRemnant}
              className="btn-secondary flex items-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors"
            >
              <RotateCw className="h-3.5 w-3.5" strokeWidth={2} />
              Rem 90°
            </button>
          </div>
          <span className="ml-auto font-mono text-xs tabular-nums text-muted">
            Total Parts{" "}
            <span className="text-2xl font-bold text-accent">
              {result.totalParts}
            </span>
          </span>
        </div>
        <NestGrid
          remnantWidth={inputs.remnantWidth}
          remnantHeight={inputs.remnantHeight}
          partWidth={inputs.partWidth}
          partHeight={inputs.partHeight}
          margins={inputs.margins}
          gapX={inputs.gapX}
          gapY={inputs.gapY}
          result={result}
          unit={unit}
        />
      </section>
    </div>
  );
}