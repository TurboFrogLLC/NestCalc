"use client";

import { coalesce } from "@/lib/nestcalc";
import type { Margins, NestResult, RemRotation } from "@/lib/types";

interface NestGridProps {
  remnantWidth: number | null;
  remnantHeight: number | null;
  partWidth: number | null;
  partHeight: number | null;
  margins: Margins;
  gapX: number | null;
  gapY: number | null;
  remRotation: RemRotation;
  result: NestResult;
  unitLabel: string;
}

export function NestGrid({
  remnantWidth,
  remnantHeight,
  partWidth,
  partHeight,
  margins,
  gapX,
  gapY,
  remRotation,
  result,
  unitLabel,
}: NestGridProps) {
  const remW = coalesce(remnantWidth);
  const remH = coalesce(remnantHeight);
  const partW = coalesce(partWidth);
  const partH = coalesce(partHeight);
  const gapAcross = coalesce(gapX);
  const gapDown = coalesce(gapY);

  const MAX_PREVIEW_PARTS = 500;
  const totalParts = result.partsAcross * result.partsDown;
  const previewCapped = totalParts > MAX_PREVIEW_PARTS;

  const parts: { x: number; y: number }[] = [];
  for (let row = 0; row < result.partsDown; row += 1) {
    for (let col = 0; col < result.partsAcross; col += 1) {
      if (parts.length >= MAX_PREVIEW_PARTS) break;
      parts.push({
        x: coalesce(margins.left) + col * (partW + gapAcross),
        y: coalesce(margins.top) + row * (partH + gapDown),
      });
    }
    if (parts.length >= MAX_PREVIEW_PARTS) break;
  }

  const maxDim = Math.max(remW, remH, 1);
  const pad = maxDim * 0.12;
  const labelSize = maxDim * 0.045;
  const stroke = maxDim * 0.006;

  const cx = remW / 2;
  const cy = remH / 2;

  const formatDim = (value: number | null) => {
    const v = coalesce(value);
    return value === null ? "—" : `${v} ${unitLabel}`;
  };

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--preview-bg)]"
      aria-label="Nest preview"
    >
      <svg
        viewBox={`${-pad} ${-pad} ${remW + pad * 2} ${remH + pad * 2}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <g transform={`rotate(${remRotation} ${cx} ${cy})`}>
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

          <rect
            x={coalesce(margins.left)}
            y={coalesce(margins.top)}
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

          <text
            x={remW / 2}
            y={remH + labelSize * 0.9}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize={labelSize}
            fontFamily="ui-monospace, monospace"
          >
            {formatDim(remnantWidth)}
          </text>

          <text
            x={-labelSize * 0.35}
            y={remH / 2}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize={labelSize}
            fontFamily="ui-monospace, monospace"
            transform={`rotate(-90 ${-labelSize * 0.35} ${remH / 2})`}
          >
            {formatDim(remnantHeight)}
          </text>

          {result.partsAcross > 0 ? (
            <text
              x={coalesce(margins.left) + Math.max(0, result.usableWidth) / 2}
              y={Math.max(coalesce(margins.top) - labelSize * 0.35, labelSize)}
              textAnchor="middle"
              fill="var(--accent)"
              fontSize={labelSize * 0.85}
              fontFamily="ui-monospace, monospace"
            >
              {result.partsAcross} across
            </text>
          ) : null}

          {result.partsDown > 0 ? (
            <text
              x={remW - labelSize * 0.5}
              y={coalesce(margins.top) + Math.max(0, result.usableHeight) / 2}
              textAnchor="start"
              fill="var(--accent)"
              fontSize={labelSize * 0.85}
              fontFamily="ui-monospace, monospace"
            >
              {result.partsDown} down
            </text>
          ) : null}
        </g>
      </svg>
      {previewCapped ? (
        <p className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-[var(--muted)]">
          Showing first {MAX_PREVIEW_PARTS} of {totalParts} parts
        </p>
      ) : null}
    </div>
  );
}