"use client";

import { useMemo } from "react";
import {
  ArrowLeftRight,
  Link2,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import { useNestInputs } from "@/hooks/useNestInputs";
import { useTheme } from "@/hooks/useTheme";
import {
  calculateNest,
  clearedInputs,
  rotateMarginsCW,
} from "@/lib/nestcalc";
import type { NestInputs, Unit } from "@/lib/types";
import { convertValue, unitLabel } from "@/lib/units";
import { QuickValuesFocusProvider } from "@/hooks/useQuickValuesFocus";
import { AuthControls } from "./AuthControls";
import { NestGrid } from "./NestGrid";
import { NumberInput } from "./NumberInput";
import { QuickValuesBar } from "./QuickValuesBar";

const toggleClass =
  "min-h-11 rounded-xl border border-[var(--btn-border)] bg-[var(--btn-bg)] px-4 py-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)]";

const rotateBtnClass =
  "flex items-center gap-1 rounded-lg border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2 py-1.5 text-xs font-semibold text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)] active:scale-[0.98]";

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
  active?: boolean;
  children: React.ReactNode;
}

function IconButton({ label, onClick, active = false, children }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      onClick={onClick}
      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors active:scale-[0.97] ${
        active
          ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)] hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)]"
          : "border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--muted)] hover:border-[var(--accent-hover)] hover:text-[var(--accent)]"
      }`}
    >
      {children}
    </button>
  );
}

interface XYInputRowProps {
  xLabel: string;
  yLabel: string;
  xValue: number | null;
  yValue: number | null;
  unit: string;
  linked: boolean;
  onXChange: (value: number | null) => void;
  onYChange: (value: number | null) => void;
  onLinkToggle: () => void;
  onSwap: () => void;
}

function XYInputRow({
  xLabel,
  yLabel,
  xValue,
  yValue,
  unit,
  linked,
  onXChange,
  onYChange,
  onLinkToggle,
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
      <div className="flex shrink-0 flex-col items-center justify-end gap-0.5 pb-[3px]">
        <IconButton label="Link X and Y" onClick={onLinkToggle} active={linked}>
          <Link2 className="h-3 w-3" strokeWidth={2} />
        </IconButton>
        <IconButton label="Swap X and Y" onClick={onSwap}>
          <ArrowLeftRight className="h-3 w-3" strokeWidth={2} />
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

  const clearAll = () => {
    setInputs((current) => clearedInputs(current.unit));
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
    <QuickValuesFocusProvider>
    <QuickValuesBar />
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 px-4 py-5 pb-8">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)]">
          NestCalc
        </h1>
        <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2">
          <AuthControls />
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

      <section className="flex h-[50px] items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3">
        <span className="font-mono text-base font-bold tabular-nums text-[var(--foreground)]">
          X{result.partsAcross} | Y{result.partsDown}
        </span>
        <span className="font-mono text-sm tabular-nums text-[var(--muted)]">
          Total Parts{" "}
          <span className="text-3xl font-bold text-[var(--accent)]">
            {result.totalParts}
          </span>
        </span>
      </section>

      <section className="flex flex-col gap-2">
        <XYInputRow
          xLabel="X [PART]"
          yLabel="Y [PART]"
          xValue={inputs.partWidth}
          yValue={inputs.partHeight}
          unit={unit}
          linked={inputs.partLinked}
          onXChange={(value) =>
            update(
              inputs.partLinked
                ? { partWidth: value, partHeight: value }
                : { partWidth: value },
            )
          }
          onYChange={(value) =>
            update(
              inputs.partLinked
                ? { partWidth: value, partHeight: value }
                : { partHeight: value },
            )
          }
          onLinkToggle={() => {
            if (inputs.partLinked) {
              update({ partLinked: false });
              return;
            }
            const linked = linkValues(inputs.partWidth, inputs.partHeight);
            update({
              partWidth: linked.x,
              partHeight: linked.y,
              partLinked: true,
            });
          }}
          onSwap={() => {
            const swapped = swapValues(inputs.partWidth, inputs.partHeight);
            update({ partWidth: swapped.x, partHeight: swapped.y });
          }}
        />
        <XYInputRow
          xLabel="X [GAP]"
          yLabel="Y [GAP]"
          xValue={inputs.gapX}
          yValue={inputs.gapY}
          unit={unit}
          linked={inputs.gapLinked}
          onXChange={(value) =>
            update(
              inputs.gapLinked
                ? { gapX: value, gapY: value }
                : { gapX: value },
            )
          }
          onYChange={(value) =>
            update(
              inputs.gapLinked
                ? { gapX: value, gapY: value }
                : { gapY: value },
            )
          }
          onLinkToggle={() => {
            if (inputs.gapLinked) {
              update({ gapLinked: false });
              return;
            }
            const linked = linkValues(inputs.gapX, inputs.gapY);
            update({
              gapX: linked.x,
              gapY: linked.y,
              gapLinked: true,
            });
          }}
          onSwap={() => {
            const swapped = swapValues(inputs.gapX, inputs.gapY);
            update({ gapX: swapped.x, gapY: swapped.y });
          }}
        />
        <div className="grid grid-cols-2 gap-2">
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
        <p className="pt-0.5 text-[11px] font-medium uppercase tracking-wider text-[var(--muted)]">
          Margins
        </p>
        <div className="grid grid-cols-2 gap-2">
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
            label="Bottom"
            value={inputs.margins.bottom}
            unit={unit}
            onChange={(value) => updateMargin("bottom", value)}
          />
          <NumberInput
            label="Top"
            value={inputs.margins.top}
            unit={unit}
            onChange={(value) => updateMargin("top", value)}
          />
        </div>
        <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-[var(--muted)]">
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

      <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-3">
        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-sm font-semibold tabular-nums text-[var(--foreground)]">
            X{result.partsAcross} | Y{result.partsDown}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={rotatePart}
              className={rotateBtnClass}
            >
              <RotateCw className="h-3.5 w-3.5" strokeWidth={2} />
              Part 90°
            </button>
            <button type="button" onClick={rotateRem} className={rotateBtnClass}>
              <RotateCw className="h-3.5 w-3.5" strokeWidth={2} />
              Rem 90°
            </button>
          </div>
          <span className="ml-auto font-mono text-xs tabular-nums text-[var(--muted)]">
            Total Parts{" "}
            <span className="text-2xl font-bold text-[var(--accent)]">
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
          unitLabel={unit}
        />
      </section>
    </div>
    </QuickValuesFocusProvider>
  );
}