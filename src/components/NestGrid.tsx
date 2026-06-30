"use client";

import { coalesce, isRemAxesSwapped } from "@/lib/nestcalc";
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

function rotatedViewBox(
  remW: number,
  remH: number,
  rotation: RemRotation,
  pad: number,
) {
  const cx = remW / 2;
  const cy = remH / 2;
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const corners = [
    { x: 0, y: 0 },
    { x: remW, y: 0 },
    { x: remW, y: remH },
    { x: 0, y: remH },
  ];

  const rotated = corners.map(({ x, y }) => {
    const dx = x - cx;
    const dy = y - cy;
    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos,
    };
  });

  const xs = rotated.map((point) => point.x);
  const ys = rotated.map((point) => point.y);
  const minX = Math.min(...xs) - pad;
  const minY = Math.min(...ys) - pad;
  const maxX = Math.max(...xs) + pad;
  const maxY = Math.max(...ys) + pad;

  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
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
  const swapAxes = isRemAxesSwapped(remRotation);

  const MAX_PREVIEW_PARTS = 500;
  const totalParts = result.partsAcross * result.partsDown;
  const previewCapped = totalParts > MAX_PREVIEW_PARTS;

  const physicalUsableW =
    remW - coalesce(margins.left) - coalesce(margins.right);
  const physicalUsableH =
    remH - coalesce(margins.top) - coalesce(margins.bottom);

  const parts: { x: number; y: number }[] = [];
  for (let across = 0; across < result.partsAcross; across += 1) {
    for (let down = 0; down < result.partsDown; down += 1) {
      if (parts.length >= MAX_PREVIEW_PARTS) break;
      if (swapAxes) {
        parts.push({
          x: coalesce(margins.left) + down * (partH + gapDown),
          y: coalesce(margins.top) + across * (partW + gapAcross),
        });
      } else {
        parts.push({
          x: coalesce(margins.left) + across * (partW + gapAcross),
          y: coalesce(margins.top) + down * (partH + gapDown),
        });
      }
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
        viewBox={rotatedViewBox(remW, remH, remRotation, pad)}
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
            width={Math.max(0, physicalUsableW)}
            height={Math.max(0, physicalUsableH)}
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
              x={
                coalesce(margins.left) +
                Math.max(0, swapAxes ? physicalUsableH : physicalUsableW) / 2
              }
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
              y={
                coalesce(margins.top) +
                Math.max(0, swapAxes ? physicalUsableW : physicalUsableH) / 2
              }
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