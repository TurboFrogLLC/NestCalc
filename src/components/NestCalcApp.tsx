"use client";

import { useMemo } from "react";
import { useNestInputs } from "@/hooks/useNestInputs";
import { calculateNest, rotateMarginsCW } from "@/lib/nestcalc";
import type { NestInputs, Unit } from "@/lib/types";
import { convertValue, unitLabel } from "@/lib/units";
import { NestGrid } from "./NestGrid";
import { NumberInput } from "./NumberInput";

function convertAll(inputs: NestInputs, to: Unit): NestInputs {
  const from = inputs.unit;
  const cv = (value: number) => convertValue(value, from, to);
  return {
    ...inputs,
    unit: to,
    partWidth: cv(inputs.partWidth),
    partHeight: cv(inputs.partHeight),
    remnantWidth: cv(inputs.remnantWidth),
    remnantHeight: cv(inputs.remnantHeight),
    gap: cv(inputs.gap),
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

  const result = useMemo(() => calculateNest(inputs), [inputs]);
  const unit = unitLabel(inputs.unit);

  const update = (patch: Partial<NestInputs>) => {
    setInputs((current) => ({ ...current, ...patch }));
  };

  const updateMargin = (key: keyof NestInputs["margins"], value: number) => {
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

  const rotateRemnant = () => {
    setInputs((current) => ({
      ...current,
      margins: rotateMarginsCW(current.margins),
    }));
  };

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-5 px-4 py-5 pb-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-100">
            NestCalc
          </h1>
          <p className="text-xs text-zinc-500">Remnant grid math</p>
        </div>
        <button
          type="button"
          onClick={toggleUnit}
          className="min-h-11 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-semibold text-amber-400 transition-colors hover:border-amber-500/60 hover:bg-zinc-800"
        >
          {inputs.unit === "in" ? "in → mm" : "mm → in"}
        </button>
      </header>

      <section className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
          Total parts
        </p>
        <p className="mt-1 font-mono text-6xl font-bold tabular-nums leading-none text-amber-400">
          {result.totalParts}
        </p>
        <p className="mt-2 font-mono text-2xl tabular-nums text-zinc-300">
          {result.partsAcross} × {result.partsDown}
        </p>
        <p className="mt-1 text-xs text-zinc-500">across × down</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <NumberInput
          label="Part X"
          value={inputs.partWidth}
          unit={unit}
          onChange={(value) => update({ partWidth: value })}
        />
        <NumberInput
          label="Part Y"
          value={inputs.partHeight}
          unit={unit}
          onChange={(value) => update({ partHeight: value })}
        />
        <NumberInput
          label="Remnant X"
          value={inputs.remnantWidth}
          unit={unit}
          onChange={(value) => update({ remnantWidth: value })}
        />
        <NumberInput
          label="Remnant Y"
          value={inputs.remnantHeight}
          unit={unit}
          onChange={(value) => update({ remnantHeight: value })}
        />
      </section>

      <section>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-zinc-500">
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

      <NumberInput
        label="Gap (edge to edge)"
        value={inputs.gap}
        unit={unit}
        onChange={(value) => update({ gap: value })}
      />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={rotatePart}
          className="min-h-14 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-amber-500/50 hover:bg-zinc-800 active:scale-[0.98]"
        >
          ↻ Rotate Part 90°
        </button>
        <button
          type="button"
          onClick={rotateRemnant}
          className="min-h-14 rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-amber-500/50 hover:bg-zinc-800 active:scale-[0.98]"
        >
          ↻ Rotate Remnant 90°
        </button>
      </div>

      <NestGrid
        remnantWidth={inputs.remnantWidth}
        remnantHeight={inputs.remnantHeight}
        partWidth={inputs.partWidth}
        partHeight={inputs.partHeight}
        margins={inputs.margins}
        gap={inputs.gap}
        result={result}
      />
    </div>
  );
}