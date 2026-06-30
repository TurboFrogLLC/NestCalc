"use client";

import { useCallback, useRef, useState } from "react";
import type { Margins, NestResult } from "@/lib/types";

interface NestGridProps {
  remnantWidth: number;
  remnantHeight: number;
  partWidth: number;
  partHeight: number;
  margins: Margins;
  gap: number;
  result: NestResult;
}

export function NestGrid({
  remnantWidth,
  remnantHeight,
  partWidth,
  partHeight,
  margins,
  gap,
  result,
}: NestGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const pinchRef = useRef<{
    distance: number;
    scale: number;
    origin: { x: number; y: number };
  } | null>(null);
  const panRef = useRef<{ x: number; y: number; ox: number; oy: number } | null>(
    null,
  );

  const resetView = useCallback(() => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch" && event.isPrimary) {
      panRef.current = {
        x: event.clientX,
        y: event.clientY,
        ox: offset.x,
        oy: offset.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (panRef.current && event.buttons > 0) {
      setOffset({
        x: panRef.current.ox + (event.clientX - panRef.current.x),
        y: panRef.current.oy + (event.clientY - panRef.current.y),
      });
    }
  };

  const onPointerUp = () => {
    panRef.current = null;
  };

  const onTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(
        a.clientX - b.clientX,
        a.clientY - b.clientY,
      );
      pinchRef.current = { distance, scale, origin: offset };
    }
  };

  const onTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    if (event.touches.length === 2 && pinchRef.current) {
      const [a, b] = [event.touches[0], event.touches[1]];
      const distance = Math.hypot(
        a.clientX - b.clientX,
        a.clientY - b.clientY,
      );
      const nextScale = Math.min(
        4,
        Math.max(1, pinchRef.current.scale * (distance / pinchRef.current.distance)),
      );
      setScale(nextScale);
    }
  };

  const onTouchEnd = () => {
    pinchRef.current = null;
  };

  const parts: { x: number; y: number }[] = [];
  for (let row = 0; row < result.partsDown; row += 1) {
    for (let col = 0; col < result.partsAcross; col += 1) {
      parts.push({
        x: margins.left + col * (partWidth + gap),
        y: margins.top + row * (partHeight + gap),
      });
    }
  }

  const maxDim = Math.max(remnantWidth, remnantHeight, 1);
  const pad = maxDim * 0.04;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-zinc-500">
        <span>Nest preview</span>
        <button
          type="button"
          onClick={resetView}
          className="rounded-md px-2 py-1 text-amber-500 hover:bg-zinc-800"
        >
          Reset view
        </button>
      </div>
      <div
        ref={containerRef}
        className="relative aspect-[4/3] w-full touch-none overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onDoubleClick={resetView}
      >
        <svg
          viewBox={`${-pad} ${-pad} ${remnantWidth + pad * 2} ${remnantHeight + pad * 2}`}
          className="h-full w-full"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: "center center",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          <rect
            x={0}
            y={0}
            width={remnantWidth}
            height={remnantHeight}
            fill="#18181b"
            stroke="#52525b"
            strokeWidth={maxDim * 0.006}
            rx={maxDim * 0.01}
          />

          <rect
            x={margins.left}
            y={margins.top}
            width={Math.max(0, result.usableWidth)}
            height={Math.max(0, result.usableHeight)}
            fill="none"
            stroke="#3f3f46"
            strokeDasharray={`${maxDim * 0.02} ${maxDim * 0.015}`}
            strokeWidth={maxDim * 0.004}
          />

          {parts.map((part, index) => (
            <rect
              key={index}
              x={part.x}
              y={part.y}
              width={partWidth}
              height={partHeight}
              fill="#f59e0b22"
              stroke="#f59e0b"
              strokeWidth={maxDim * 0.004}
              rx={maxDim * 0.005}
            />
          ))}
        </svg>
      </div>
      <p className="text-center text-[11px] text-zinc-600">
        Pinch to zoom · drag to pan · double-tap to reset
      </p>
    </div>
  );
}