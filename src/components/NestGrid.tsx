"use client";

import { toNumber } from "@/lib/nestcalc";
import type { Margins, NestResult } from "@/lib/types";
import { formatDimension } from "@/lib/units";

interface NestGridProps {
  remnantWidth: number | null;
  remnantHeight: number | null;
  partWidth: number | null;
  partHeight: number | null;
  margins: Margins;
  gapX: number | null;
  gapY: number | null;
  result: NestResult;
  unit: string;
}

export function NestGrid({
  remnantWidth,
  remnantHeight,
  partWidth,
  partHeight,
  margins,
  gapX,
  gapY,
  result,
  unit,
}: NestGridProps) {
  const remW = Math.max(toNumber(remnantWidth), 0.001);
  const remH = Math.max(toNumber(remnantHeight), 0.001);
  const partW = toNumber(partWidth);
  const partH = toNumber(partHeight);
  const gapAcross = toNumber(gapX);
  const gapDown = toNumber(gapY);
  const marginLeft = toNumber(margins.left);
  const marginTop = toNumber(margins.top);

  const MAX_PREVIEW_PARTS = 500;
  const totalParts = result.partsAcross * result.partsDown;
  const previewCapped = totalParts > MAX_PREVIEW_PARTS;

  const parts: { x: number; y: number }[] = [];
  for (let row = 0; row < result.partsDown; row += 1) {
    for (let col = 0; col < result.partsAcross; col += 1) {
      if (parts.length >= MAX_PREVIEW_PARTS) break;
      parts.push({
        x: marginLeft + col * (partW + gapAcross),
        y: marginTop + row * (partH + gapDown),
      });
    }
    if (parts.length >= MAX_PREVIEW_PARTS) break;
  }

  const maxDim = Math.max(remW, remH, 1);
  const pad = maxDim * 0.12;
  const labelSize = maxDim * 0.045;
  const stroke = maxDim * 0.004;

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-card bg-preview">
      <svg
        viewBox={`${-pad} ${-pad} ${remW + pad * 2} ${remH + pad * 2}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <rect
          x={0}
          y={0}
          width={remW}
          height={remH}
          className="fill-preview-rem stroke-preview-rem"
          strokeWidth={maxDim * 0.006}
          rx={maxDim * 0.01}
        />

        <rect
          x={marginLeft}
          y={marginTop}
          width={Math.max(0, result.usableWidth)}
          height={Math.max(0, result.usableHeight)}
          fill="none"
          className="stroke-preview-usable"
          strokeDasharray={`${maxDim * 0.02} ${maxDim * 0.015}`}
          strokeWidth={stroke}
        />

        {parts.map((part, index) => (
          <rect
            key={index}
            x={part.x}
            y={part.y}
            width={partW}
            height={partH}
            className="fill-part stroke-part"
            strokeWidth={stroke}
            rx={maxDim * 0.005}
          />
        ))}

        <text
          x={remW / 2}
          y={remH + pad * 0.55}
          textAnchor="middle"
          className="fill-label"
          fontSize={labelSize}
          fontFamily="var(--font-geist-mono), monospace"
        >
          {formatDimension(remnantWidth, unit)}
        </text>

        <text
          x={-pad * 0.55}
          y={remH / 2}
          textAnchor="middle"
          className="fill-label"
          fontSize={labelSize}
          fontFamily="var(--font-geist-mono), monospace"
          transform={`rotate(-90, ${-pad * 0.55}, ${remH / 2})`}
        >
          {formatDimension(remnantHeight, unit)}
        </text>

        {result.partsAcross > 0 ? (
          <text
            x={marginLeft + result.usableWidth / 2}
            y={marginTop - maxDim * 0.02}
            textAnchor="middle"
            className="fill-label-muted"
            fontSize={labelSize * 0.85}
            fontFamily="var(--font-geist-mono), monospace"
          >
            {result.partsAcross} across
          </text>
        ) : null}

        {result.partsDown > 0 ? (
          <text
            x={marginLeft + result.usableWidth + maxDim * 0.02}
            y={marginTop + result.usableHeight / 2}
            textAnchor="start"
            dominantBaseline="middle"
            className="fill-label-muted"
            fontSize={labelSize * 0.85}
            fontFamily="var(--font-geist-mono), monospace"
          >
            {result.partsDown} down
          </text>
        ) : null}
      </svg>
      {previewCapped ? (
        <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-muted">
          Showing first {MAX_PREVIEW_PARTS} of {totalParts} parts
        </p>
      ) : null}
    </div>
  );
}