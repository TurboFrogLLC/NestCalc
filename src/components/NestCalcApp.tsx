"use client";

import { useMemo } from "react";
import {
  ArrowLeftRight,
  Link2,
  Moon,
  RotateCcw,
  RotateCw,
  Sun,
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

const iconBtnClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--btn-border)] bg-[var(--btn-bg)] text-[var(--muted)] transition-colors hover:border-[var(--accent-hover)] hover:text-[var(--accent)] active:scale-[0.97]";

const unitBtnClass =
  "flex h-9 min-w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2 font-mono text-xs font-bold uppercase text-[var(--accent)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)] active:scale-[0.97]";

const rotateBtnClass =
  "flex shrink-0 items-center gap-0.5 rounded-md border border-[var(--btn-border)] bg-[var(--btn-bg)] px-1.5 py-1 text-[10px] font-semibold leading-none text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)] active:scale-[0.98] landscape-phone:px-1 landscape-phone:py-0.5";

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
      <div className="nestcalc-xy-icons flex shrink-0 flex-col items-center justify-end gap-0.5 pb-[3px]">
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

  const partsSummary = (
    <span className="font-mono text-xs tabular-nums text-[var(--foreground)]">
      Parts ={" "}
      <span className="font-bold text-[var(--accent)]">{result.totalParts}</span>
    </span>
  );

  return (
    <QuickValuesFocusProvider>
      <QuickValuesBar />
      <div className="mx-auto flex w-full max-w-lg flex-col gap-3 px-3 py-3 pb-6 landscape-phone:box-border landscape-phone:h-[100dvh] landscape-phone:max-h-[100dvh] landscape-phone:max-w-none landscape-phone:gap-2 landscape-phone:overflow-hidden landscape-phone:px-2 landscape-phone:py-2 landscape-phone:pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <header className="flex h-10 shrink-0 items-center gap-2">
          <h1 className="shrink-0 text-lg font-semibold tracking-tight text-[var(--foreground)]">
            NestCalc
          </h1>
          <div className="ml-auto flex items-center gap-1">
            <AuthControls />
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
              className={iconBtnClass}
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" strokeWidth={2} />
              ) : (
                <Moon className="h-4 w-4" strokeWidth={2} />
              )}
            </button>
            <button
              type="button"
              onClick={toggleUnit}
              aria-label={`Switch to ${inputs.unit === "in" ? "millimeters" : "inches"}`}
              title={`Units: ${inputs.unit}`}
              className={unitBtnClass}
            >
              {inputs.unit}
            </button>
            <button
              type="button"
              onClick={clearAll}
              aria-label="Clear all fields"
              title="Clear all"
              className={iconBtnClass}
            >
              <RotateCcw className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-col gap-3 landscape-phone:flex-1 landscape-phone:flex-row landscape-phone:gap-2 landscape-phone:overflow-hidden">
          <div className="nestcalc-inputs flex min-h-0 flex-col gap-2 landscape-phone:w-[44%] landscape-phone:shrink-0 landscape-phone:gap-1 landscape-phone:overflow-y-auto landscape-phone:overscroll-contain landscape-phone:pr-0.5">
            <section className="flex h-9 shrink-0 items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--card)] px-3 landscape-phone:hidden">
              <span className="font-mono text-sm font-bold tabular-nums text-[var(--foreground)]">
                X{result.partsAcross} | Y{result.partsDown}
              </span>
              {partsSummary}
            </section>

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
            <div className="grid grid-cols-2 gap-2 landscape-phone:gap-1">
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
            <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--muted)] landscape-phone:pt-0 landscape-phone:text-[10px]">
              Margins
            </p>
            <div className="grid grid-cols-2 gap-2 landscape-phone:gap-1">
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
            <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-[var(--muted)] landscape-phone:mt-0 landscape-phone:text-[10px]">
              <input
                type="checkbox"
                checked={inputs.moveMarginsWithRotation}
                onChange={(event) =>
                  update({ moveMarginsWithRotation: event.target.checked })
                }
                className="h-3.5 w-3.5 rounded border-[var(--input-border)] accent-[var(--accent)]"
              />
              Move margins with rotation
            </label>
          </div>

          <section className="flex min-h-0 flex-col rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-2 landscape-phone:min-w-0 landscape-phone:flex-1 landscape-phone:p-1.5">
            <div className="mb-2 flex h-8 shrink-0 items-center gap-1.5 overflow-hidden landscape-phone:mb-1 landscape-phone:h-7">
              <span className="shrink-0 font-mono text-xs font-bold tabular-nums text-[var(--foreground)]">
                X{result.partsAcross} | Y{result.partsDown}
              </span>
              <button type="button" onClick={rotatePart} className={rotateBtnClass}>
                <RotateCw className="h-3 w-3 shrink-0" strokeWidth={2} />
                Part 90°
              </button>
              <button type="button" onClick={rotateRem} className={rotateBtnClass}>
                <RotateCw className="h-3 w-3 shrink-0" strokeWidth={2} />
                Rem 90°
              </button>
              <span className="ml-auto shrink-0">{partsSummary}</span>
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
      </div>
    </QuickValuesFocusProvider>
  );
}
