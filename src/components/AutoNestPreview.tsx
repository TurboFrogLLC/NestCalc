"use client";

import type {
  AutoNestBlankResult,
  AutoNestTwoGroupResult,
} from "@/lib/types";

interface AutoNestPreviewProps {
  twoGroup: AutoNestTwoGroupResult;
  remnantWidth: number | null;
  remnantHeight: number | null;
  unitLabel: string;
  className?: string;
}

interface BlankPlacement {
  blank: AutoNestBlankResult;
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

function coalesce(value: number | null | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function formatValue(value: number): string {
  const rounded = Math.round(value * 1000) / 1000;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(3);
}

function formatDim(width: number, height: number, unitLabel: string): string {
  return `${formatValue(width)} x ${formatValue(height)} ${unitLabel}`;
}

function formatMargins(blank: AutoNestBlankResult): string {
  const margins = blank.achievedMargins;
  return `M L${formatValue(coalesce(margins.left))} R${formatValue(
    coalesce(margins.right),
  )} T${formatValue(coalesce(margins.top))} B${formatValue(
    coalesce(margins.bottom),
  )}`;
}

function groupClassName(orientation: AutoNestBlankResult["group"]["orientation"]) {
  return orientation === "0deg"
    ? "autonest-preview-group-zero"
    : "autonest-preview-group-ninety";
}

function getBlankPlacements(
  twoGroup: AutoNestTwoGroupResult,
): BlankPlacement[] {
  if (twoGroup.trimLine.orientation === "vertical") {
    return [
      {
        blank: twoGroup.blanks[0],
        index: 0,
        x: 0,
        y: 0,
        width: twoGroup.blanks[0].width,
        height: twoGroup.blanks[0].height,
      },
      {
        blank: twoGroup.blanks[1],
        index: 1,
        x: twoGroup.blanks[0].width,
        y: 0,
        width: twoGroup.blanks[1].width,
        height: twoGroup.blanks[1].height,
      },
    ];
  }

  return [
    {
      blank: twoGroup.blanks[0],
      index: 0,
      x: 0,
      y: 0,
      width: twoGroup.blanks[0].width,
      height: twoGroup.blanks[0].height,
    },
    {
      blank: twoGroup.blanks[1],
      index: 1,
      x: 0,
      y: twoGroup.blanks[0].height,
      width: twoGroup.blanks[1].width,
      height: twoGroup.blanks[1].height,
    },
  ];
}

export function AutoNestPreview({
  twoGroup,
  remnantWidth,
  remnantHeight,
  unitLabel,
  className = "",
}: AutoNestPreviewProps) {
  const remW = Math.max(coalesce(remnantWidth), 0.001);
  const remH = Math.max(coalesce(remnantHeight), 0.001);
  const maxDim = Math.max(remW, remH, 1);
  const pad = maxDim * 0.1;
  const labelSize = maxDim * 0.04;
  const stroke = maxDim * 0.006;
  const trim = twoGroup.trimLine;
  const placements = getBlankPlacements(twoGroup);

  return (
    <div
      className={`nestcalc-split-preview-grid autonest-preview relative flex aspect-[4/3] w-full flex-col overflow-hidden rounded-xl border border-[var(--card-border)] bg-[var(--preview-bg)] ${className}`}
      role="img"
      aria-label="AutoNest computed preview"
      data-testid="autonest-preview"
    >
      <div className="min-h-0 flex-1">
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
            fill="var(--rem-fill)"
            stroke="var(--rem-stroke)"
            strokeWidth={stroke}
            rx={maxDim * 0.01}
          />

          {placements.map((placement) => {
            const { blank, x, y, width, height } = placement;
            const marginLeft = coalesce(blank.achievedMargins.left);
            const marginTop = coalesce(blank.achievedMargins.top);
            const groupX = x + marginLeft;
            const groupY = y + marginTop;
            const labelX = x + width / 2;
            const labelY = y + height / 2;

            return (
              <g key={`${blank.group.orientation}-${placement.index}`}>
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="none"
                  stroke="var(--autonest-blank-stroke)"
                  strokeWidth={stroke * 0.75}
                  strokeDasharray={`${maxDim * 0.018} ${maxDim * 0.012}`}
                />
                <rect
                  x={groupX}
                  y={groupY}
                  width={Math.max(0, blank.group.boundingBox.width)}
                  height={Math.max(0, blank.group.boundingBox.height)}
                  className={groupClassName(blank.group.orientation)}
                  strokeWidth={stroke}
                  rx={maxDim * 0.008}
                />
                <text
                  x={labelX}
                  y={labelY - labelSize * 0.15}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--foreground)"
                  fontSize={labelSize}
                  fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                  fontWeight={700}
                >
                  {blank.group.orientation} x{blank.group.count}
                </text>
                <text
                  x={labelX}
                  y={labelY + labelSize * 1.05}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--muted)"
                  fontSize={labelSize * 0.72}
                  fontFamily="var(--font-geist-mono), ui-monospace, monospace"
                >
                  {formatDim(width, height, unitLabel)}
                </text>
              </g>
            );
          })}

          {trim.orientation === "vertical" ? (
            <rect
              x={trim.position - stroke * 0.7}
              y={0}
              width={stroke * 1.4}
              height={remH}
              className="autonest-preview-trim-line"
              fill="var(--autonest-trim-stroke)"
              data-testid="autonest-trim-line"
            />
          ) : (
            <rect
              x={0}
              y={trim.position - stroke * 0.7}
              width={remW}
              height={stroke * 1.4}
              className="autonest-preview-trim-line"
              fill="var(--autonest-trim-stroke)"
              data-testid="autonest-trim-line"
            />
          )}

          <text
            x={remW / 2}
            y={remH + pad * 0.5}
            textAnchor="middle"
            fill="var(--muted)"
            fontSize={labelSize}
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
          >
            {formatDim(remW, remH, unitLabel)}
          </text>

          <text
            x={trim.orientation === "vertical" ? trim.position : remW / 2}
            y={trim.orientation === "vertical" ? -pad * 0.35 : trim.position - labelSize * 0.7}
            textAnchor="middle"
            fill="var(--autonest-trim-stroke)"
            fontSize={labelSize * 0.82}
            fontFamily="var(--font-geist-mono), ui-monospace, monospace"
            fontWeight={700}
          >
            Trim {trim.orientation} @ {formatValue(trim.position)}
          </text>
        </svg>
      </div>

      <div className="autonest-preview-summary grid shrink-0 gap-1 border-t border-[var(--card-border)] bg-[var(--card)] px-2 py-1.5 font-mono text-[10px] leading-tight text-[var(--muted)]">
        {twoGroup.blanks.map((blank, index) => (
          <div
            key={blank.group.orientation}
            className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5"
            data-testid={`autonest-preview-group-${blank.group.orientation}`}
          >
            <span className="font-bold text-[var(--foreground)]">
              {blank.group.orientation} x{blank.group.count}
            </span>
            <span>
              B{index + 1} {formatDim(blank.width, blank.height, unitLabel)}
            </span>
            <span>{formatMargins(blank)}</span>
          </div>
        ))}
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
          <span data-testid="autonest-preview-trim-summary">
            Trim {trim.orientation} @ {formatValue(trim.position)} {unitLabel}
          </span>
          <span>
            Offset X{formatValue(twoGroup.suggestedOriginOffset.x)} Y
            {formatValue(twoGroup.suggestedOriginOffset.y)} {unitLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
