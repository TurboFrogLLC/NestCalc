"use client";

import { coalesce } from "@/lib/nestcalc";
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
  unitLabel: string;
  className?: string;
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
  unitLabel,
  className = "",
}: NestGridProps) {
  const remW = Math.max(coalesce(remnantWidth), 0.001);
  const remH = Math.max(coalesce(remnantHeight), 0.001);
  const partW = coalesce(partWidth);
  const partH = coalesce(partHeight);
  const gapAcross = coalesce(gapX);
  const gapDown = coalesce(gapY);
  const marginLeft = coalesce(margins.left);
  const marginBottom = coalesce(margins.bottom);

  const MAX_PREVIEW_PARTS = 500;
  const totalParts = result.partsAcross * result.partsDown;
  const previewCapped = totalParts > MAX_PREVIEW_PARTS;

  const parts: { x: number; y: number }[] = [];
  for (let row = 0; row < result.partsDown; row += 1) {
    for (let col = 0; col < result.partsAcross; col += 1) {
      if (parts.length >= MAX_PREVIEW_PARTS) break;
      parts.push({
        x: marginLeft + col * (partW + gapAcross),
        y: marginBottom + row * (partH + gapDown),
      });
    }
    if (parts.length >= MAX_PREVIEW_PARTS) break;
  }

  const maxDim = Math.max(remW, remH, 1);
  const pad = maxDim * 0.12;
  const labelSize = maxDim * 0.045;
  const stroke = maxDim * 0.006;
  const originMark = maxDim * 0.04;
  const originLabelX = -pad * 0.45;
  const originLabelY = remH + pad * 0.42;

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--preview-bg)] landscape-phone:aspect-auto landscape-phone:min-h-0 landscape-phone:flex-1 ${className}`}
      aria-label="Nest preview"
    >
      <svg
        viewBox={`${-pad} ${-pad} ${remW + pad * 2} ${remH + pad * 2}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`translate(0, ${remH}) scale(1, -1)`}>
          <rect
            x={0}
            y={0}
            width={remW}
            height={remH}
            fill="var(--rem-fill)"
            stroke="var(--rem-stroke)"
            strokeWidth={stroke}
            rx={maxDim * 0.01}
          />

          {marginLeft > 0 ? (
            <rect
              x={0}
              y={0}
              width={marginLeft}
              height={remH}
              fill="var(--margin-fill)"
            />
          ) : null}

          {marginBottom > 0 ? (
            <rect
              x={0}
              y={0}
              width={remW}
              height={marginBottom}
              fill="var(--margin-fill)"
            />
          ) : null}

          <rect
            x={marginLeft}
            y={marginBottom}
            width={Math.max(0, result.usableWidth)}
            height={Math.max(0, result.usableHeight)}
            fill="none"
            stroke="var(--usable-stroke)"
            strokeDasharray={`${maxDim * 0.02} ${maxDim * 0.015}`}
            strokeWidth={maxDim * 0.004}
          />

          {parts.map((part, index) => (
            <rect
              key={index}
              x={part.x}
              y={part.y}
              width={partW}
              height={partH}
              fill="var(--part-fill)"
              stroke="var(--part-stroke)"
              strokeWidth={maxDim * 0.004}
              rx={maxDim * 0.005}
            />
          ))}
        </g>

        <g>
          <path
            d={`M 0 ${remH} L ${originMark} ${remH} M 0 ${remH} L 0 ${remH - originMark}`}
            fill="none"
            stroke="var(--origin-stroke)"
            strokeWidth={maxDim * 0.005}
            strokeLinecap="square"
          />
          <circle
            cx={0}
            cy={remH}
            r={maxDim * 0.008}
            fill="var(--accent)"
          />
          <text
            x={originLabelX}
            y={originLabelY}
            textAnchor="middle"
            fill="var(--origin-stroke)"
            fontSize={labelSize * 0.7}
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          >
            0,0
          </text>
        </g>

        <text
          x={remW / 2}
          y={remH + pad * 0.55}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize={labelSize}
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        >
          {formatDimension(remnantWidth, unitLabel)}
        </text>

        <text
          x={-pad * 0.55}
          y={remH / 2}
          textAnchor="middle"
          fill="var(--muted)"
          fontSize={labelSize}
          fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          transform={`rotate(-90, ${-pad * 0.55}, ${remH / 2})`}
        >
          {formatDimension(remnantHeight, unitLabel)}
        </text>

        {result.partsAcross > 0 ? (
          <text
            x={marginLeft + result.usableWidth / 2}
            y={Math.max(
              remH - marginBottom - result.usableHeight - pad * 0.55,
              labelSize,
            )}
            textAnchor="middle"
            dominantBaseline="auto"
            fill="var(--accent)"
            fontSize={labelSize}
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          >
            {result.partsAcross}
          </text>
        ) : null}

        {result.partsDown > 0 ? (
          <text
            x={marginLeft + result.usableWidth + pad * 0.55}
            y={remH - marginBottom - result.usableHeight / 2}
            textAnchor="start"
            dominantBaseline="middle"
            fill="var(--accent)"
            fontSize={labelSize}
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          >
            {result.partsDown}
          </text>
        ) : null}
      </svg>
      {previewCapped ? (
        <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-[var(--muted)]">
          Showing first {MAX_PREVIEW_PARTS} of {totalParts} parts
        </p>
      ) : null}
    </div>
  );
}