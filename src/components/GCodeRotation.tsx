"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  analyzeGCode,
  generateRotatedGCode,
  rotateBounds,
  type Bounds,
  type GCodeAnalysis,
  type GCodeDiagnostic,
  type GCodeGeneration,
} from "@/lib/gcodeRotation";

const SOURCE_DEBOUNCE_MS = 50;
const OUTPUT_FILENAME = "nestcalc-rotated.nc";

const inputClass =
  "w-full min-w-0 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 font-mono text-sm text-[var(--input-text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

const primaryButtonClass =
  "rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

const secondaryButtonClass =
  "rounded-lg border border-[var(--btn-border)] bg-[var(--btn-bg)] px-3 py-2 text-sm font-semibold text-[var(--btn-text)] transition-colors hover:border-[var(--accent-hover)] hover:text-[var(--accent)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

type SuccessfulGeneration = Extract<GCodeGeneration, { ok: true }>;

interface SvgViewport {
  minX: number;
  minY: number;
  width: number;
  height: number;
}

function parseFiniteAngle(value: string): number | null {
  if (value.trim() === "") return null;

  const angle = Number(value);
  return Number.isFinite(angle) ? angle : null;
}

function previewNumber(value: number): string {
  const normalized = Object.is(value, -0) ? 0 : value;
  return normalized.toFixed(3);
}

function svgViewport(bounds: Bounds): SvgViewport {
  const minDataX = Math.min(bounds.minX, 0);
  const maxDataX = Math.max(bounds.maxX, 0);
  const minDataY = Math.min(bounds.minY, 0);
  const maxDataY = Math.max(bounds.maxY, 0);
  const spanX = Math.max(maxDataX - minDataX, 1);
  const spanY = Math.max(maxDataY - minDataY, 1);
  const padding = Math.max(spanX, spanY) * 0.12;

  return {
    minX: minDataX - padding,
    minY: -(maxDataY + padding),
    width: spanX + padding * 2,
    height: spanY + padding * 2,
  };
}

function Diagnostics({ diagnostics }: { diagnostics: GCodeDiagnostic[] }) {
  if (diagnostics.length === 0) return null;

  return (
    <div
      className="rounded-lg border border-red-500/50 bg-red-500/10 px-3 py-2 text-sm text-red-400"
      data-testid="gcode-diagnostics"
      role="alert"
    >
      <p className="font-semibold">G-code errors</p>
      <ul className="mt-1 list-disc space-y-1 pl-5 font-mono text-xs">
        {diagnostics.map((diagnostic, index) => (
          <li key={`${diagnostic.line}-${diagnostic.reason}-${index}`}>
            Line {diagnostic.line}: {diagnostic.reason}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BoundsPreview({ bounds }: { bounds: Bounds }) {
  const viewport = svgViewport(bounds);
  const rectangleWidth = Math.max(bounds.maxX - bounds.minX, 0);
  const rectangleHeight = Math.max(bounds.maxY - bounds.minY, 0);

  return (
    <div className="min-w-0" data-testid="gcode-preview">
      <svg
        aria-labelledby="gcode-preview-title gcode-preview-description"
        className="aspect-[4/3] w-full rounded-lg border border-[var(--card-border)] bg-[var(--preview-bg)]"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox={`${viewport.minX} ${viewport.minY} ${viewport.width} ${viewport.height}`}
      >
        <title id="gcode-preview-title">Conservative rotated bounds</title>
        <desc id="gcode-preview-description">
          Rotated input bounds around the G-code origin.
        </desc>
        <line
          stroke="var(--origin-stroke)"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
          x1={viewport.minX}
          x2={viewport.minX + viewport.width}
          y1={0}
          y2={0}
        />
        <line
          stroke="var(--origin-stroke)"
          strokeDasharray="4 4"
          vectorEffect="non-scaling-stroke"
          x1={0}
          x2={0}
          y1={viewport.minY}
          y2={viewport.minY + viewport.height}
        />
        <rect
          fill="var(--part-fill)"
          height={rectangleHeight}
          stroke="var(--part-stroke)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
          width={rectangleWidth}
          x={bounds.minX}
          y={-bounds.maxY}
        />
        <circle
          cx={0}
          cy={0}
          fill="var(--accent)"
          r={Math.max(viewport.width, viewport.height) * 0.012}
        />
      </svg>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px] tabular-nums text-[var(--muted)]">
        <div className="flex justify-between gap-2">
          <dt>Min X</dt>
          <dd className="text-[var(--foreground)]">{previewNumber(bounds.minX)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Max X</dt>
          <dd className="text-[var(--foreground)]">{previewNumber(bounds.maxX)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Min Y</dt>
          <dd className="text-[var(--foreground)]">{previewNumber(bounds.minY)}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Max Y</dt>
          <dd className="text-[var(--foreground)]">{previewNumber(bounds.maxY)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function GCodeRotation() {
  const [source, setSource] = useState("");
  const [angleText, setAngleText] = useState("0");
  const [analysis, setAnalysis] = useState<GCodeAnalysis>(() =>
    analyzeGCode(""),
  );
  const [parsePending, setParsePending] = useState(false);
  const [previewBounds, setPreviewBounds] = useState<Bounds | null>(null);
  const [generated, setGenerated] = useState<SuccessfulGeneration | null>(null);
  const [outputStale, setOutputStale] = useState(false);
  const [generationDiagnostics, setGenerationDiagnostics] = useState<
    GCodeDiagnostic[]
  >([]);
  const [angleError, setAngleError] = useState<string | null>(null);
  const [outputStatus, setOutputStatus] = useState<string | null>(null);

  const sourceRef = useRef(source);
  const sourceRevisionRef = useRef(0);
  const angleTextRef = useRef(angleText);
  const analysisRef = useRef(analysis);
  const parseTimerRef = useRef<number | null>(null);
  const previewFrameRef = useRef<number | null>(null);
  const outputFreshRef = useRef(false);

  const schedulePreview = useCallback(() => {
    if (document.hidden || previewFrameRef.current !== null) return;

    previewFrameRef.current = window.requestAnimationFrame(() => {
      previewFrameRef.current = null;
      const latestAnalysis = analysisRef.current;
      const latestAngle = parseFiniteAngle(angleTextRef.current);

      if (!latestAnalysis.ok || latestAngle === null) {
        setPreviewBounds(null);
        return;
      }

      setPreviewBounds(rotateBounds(latestAnalysis.bounds, latestAngle));
    });
  }, []);

  const commitAnalysis = useCallback(
    (nextAnalysis: GCodeAnalysis, revision: number) => {
      if (revision !== sourceRevisionRef.current) return false;

      analysisRef.current = nextAnalysis;
      setAnalysis(nextAnalysis);
      setParsePending(false);
      schedulePreview();
      return true;
    },
    [schedulePreview],
  );

  const flushLatestAnalysis = useCallback(() => {
    if (parseTimerRef.current !== null) {
      window.clearTimeout(parseTimerRef.current);
      parseTimerRef.current = null;
    }

    const revision = sourceRevisionRef.current;
    const nextAnalysis = analyzeGCode(sourceRef.current);
    commitAnalysis(nextAnalysis, revision);
    return nextAnalysis;
  }, [commitAnalysis]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (previewFrameRef.current !== null) {
          window.cancelAnimationFrame(previewFrameRef.current);
          previewFrameRef.current = null;
        }
        return;
      }

      schedulePreview();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    schedulePreview();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (parseTimerRef.current !== null) {
        window.clearTimeout(parseTimerRef.current);
      }
      if (previewFrameRef.current !== null) {
        window.cancelAnimationFrame(previewFrameRef.current);
      }
    };
  }, [schedulePreview]);

  const handleSourceChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const nextSource = event.target.value;
    const nextRevision = sourceRevisionRef.current + 1;

    sourceRevisionRef.current = nextRevision;
    sourceRef.current = nextSource;
    setSource(nextSource);
    setParsePending(true);
    setOutputStale(true);
    outputFreshRef.current = false;
    setGenerationDiagnostics([]);
    setOutputStatus(null);

    if (parseTimerRef.current !== null) {
      window.clearTimeout(parseTimerRef.current);
    }

    parseTimerRef.current = window.setTimeout(() => {
      parseTimerRef.current = null;
      const nextAnalysis = analyzeGCode(nextSource);
      commitAnalysis(nextAnalysis, nextRevision);
    }, SOURCE_DEBOUNCE_MS);
  };

  const handleAngleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextAngle = event.target.value;

    angleTextRef.current = nextAngle;
    setAngleText(nextAngle);
    setAngleError(null);
    setOutputStale(true);
    outputFreshRef.current = false;
    setGenerationDiagnostics([]);
    setOutputStatus(null);
    schedulePreview();
  };

  const handleGenerate = () => {
    outputFreshRef.current = false;
    setOutputStatus(null);
    setGenerationDiagnostics([]);

    const latestAnalysis = flushLatestAnalysis();
    const angle = parseFiniteAngle(angleTextRef.current);

    if (angle === null) {
      setGenerated(null);
      setAngleError("Enter a finite rotation angle.");
      return;
    }

    setAngleError(null);
    if (!latestAnalysis.ok) {
      setGenerated(null);
      setGenerationDiagnostics(latestAnalysis.diagnostics);
      return;
    }

    const result = generateRotatedGCode(sourceRef.current, angle);
    if (!result.ok) {
      setGenerated(null);
      setGenerationDiagnostics(result.diagnostics);
      return;
    }

    setGenerated(result);
    setOutputStale(false);
    outputFreshRef.current = true;
    schedulePreview();
  };

  const outputActionsEnabled = generated !== null && !outputStale;

  const handleCopy = async () => {
    if (
      !outputActionsEnabled ||
      !outputFreshRef.current ||
      generated === null
    ) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generated.output);
      setOutputStatus("Copied.");
    } catch {
      setOutputStatus("Copy failed. Select and copy the output manually.");
    }
  };

  const handleDownload = () => {
    if (
      !outputActionsEnabled ||
      !outputFreshRef.current ||
      generated === null
    ) {
      return;
    }

    const blob = new Blob([generated.output], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = OUTPUT_FILENAME;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setOutputStatus(`Downloaded ${OUTPUT_FILENAME}.`);
  };

  const sourceDiagnostics =
    !parsePending && !analysis.ok ? analysis.diagnostics : [];
  const diagnostics =
    generationDiagnostics.length > 0
      ? generationDiagnostics
      : sourceDiagnostics;
  const angle = parseFiniteAngle(angleText);
  const previewState = parsePending
    ? "pending"
    : !analysis.ok
      ? "invalid-source"
      : angle === null
        ? "invalid-angle"
        : previewBounds === null
          ? "pending"
          : "ready";

  return (
    <section
      aria-labelledby="gcode-rotation-heading"
      className="flex min-w-0 flex-col gap-3"
      data-testid="gcode-rotation"
    >
      <div>
        <h2
          className="text-base font-semibold text-[var(--foreground)]"
          id="gcode-rotation-heading"
        >
          G-code rotation
        </h2>
        <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
          Rotate the supported RS274 XY subset counterclockwise around the code
          origin. Review diagnostics before using generated output.
        </p>
      </div>

      <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <div>
            <label
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
              htmlFor="gcode-source"
            >
              Source G-code
            </label>
            <textarea
              aria-describedby="gcode-source-help"
              aria-invalid={!parsePending && !analysis.ok}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className={`${inputClass} min-h-64 resize-y whitespace-pre leading-relaxed`}
              data-testid="gcode-source"
              id="gcode-source"
              onChange={handleSourceChange}
              placeholder={"G90 G21 G17\nG00 X0 Y0\nG01 X25 Y10"}
              rows={12}
              spellCheck={false}
              value={source}
              wrap="off"
            />
            <p className="mt-1 text-[11px] text-[var(--muted)]" id="gcode-source-help">
              Requires explicit G90 and G20 or G21 before transformed motion.
            </p>
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-36 flex-1">
              <label
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--muted)]"
                htmlFor="gcode-angle"
              >
                Counterclockwise angle
              </label>
              <div className="relative">
                <input
                  aria-describedby={angleError ? "gcode-angle-error" : undefined}
                  aria-invalid={angle === null}
                  className={`${inputClass} pr-12 text-base tabular-nums`}
                  data-testid="gcode-angle"
                  id="gcode-angle"
                  inputMode="decimal"
                  onChange={handleAngleChange}
                  step="any"
                  type="number"
                  value={angleText}
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted)]">
                  deg
                </span>
              </div>
            </div>
            <button
              className={primaryButtonClass}
              data-testid="gcode-generate"
              onClick={handleGenerate}
              type="button"
            >
              Generate
            </button>
          </div>

          {angleError ? (
            <p className="text-sm text-red-400" id="gcode-angle-error" role="alert">
              {angleError}
            </p>
          ) : null}
          <Diagnostics diagnostics={diagnostics} />
        </div>

        <section
          aria-labelledby="gcode-preview-heading"
          aria-busy={parsePending}
          className="min-w-0 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3"
          data-preview-state={previewState}
        >
          <h3
            className="text-sm font-semibold text-[var(--foreground)]"
            id="gcode-preview-heading"
          >
            Conservative bounds preview
          </h3>
          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
            Rotated input bounds; may be larger than the actual toolpath.
          </p>
          <p
            aria-live="polite"
            className="my-2 min-h-5 text-xs text-[var(--muted)]"
            data-testid="gcode-preview-status"
          >
            {previewState === "pending"
              ? "Updating preview…"
              : previewState === "invalid-source"
                ? "Preview unavailable — fix G-code errors."
                : previewState === "invalid-angle"
                  ? "Preview unavailable — enter a finite angle."
                  : "Preview ready."}
          </p>
          {previewState === "ready" && previewBounds !== null ? (
            <BoundsPreview bounds={previewBounds} />
          ) : (
            <div
              aria-hidden="true"
              className="aspect-[4/3] w-full rounded-lg border border-dashed border-[var(--card-border)] bg-[var(--preview-bg)]"
            />
          )}
        </section>
      </div>

      <section
        aria-labelledby="gcode-output-heading"
        className="min-w-0 rounded-xl border border-[var(--card-border)] bg-[var(--card)] p-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3
            className="text-sm font-semibold text-[var(--foreground)]"
            id="gcode-output-heading"
          >
            Generated G-code
          </h3>
          <div className="flex gap-2">
            <button
              aria-label="Copy generated G-code"
              className={secondaryButtonClass}
              data-testid="gcode-copy"
              disabled={!outputActionsEnabled}
              onClick={handleCopy}
              type="button"
            >
              Copy
            </button>
            <button
              aria-label="Download generated G-code as an NC file"
              className={secondaryButtonClass}
              data-testid="gcode-download"
              disabled={!outputActionsEnabled}
              onClick={handleDownload}
              type="button"
            >
              Download .nc
            </button>
          </div>
        </div>

        {generated !== null && outputStale ? (
          <p
            className="mt-2 text-sm font-medium text-amber-400"
            data-testid="gcode-output-stale"
            id="gcode-output-stale"
            role="status"
          >
            Output out of date — Generate again.
          </p>
        ) : null}

        <label className="sr-only" htmlFor="gcode-output">
          Generated G-code output
        </label>
        <textarea
          aria-describedby={
            generated !== null && outputStale ? "gcode-output-stale" : undefined
          }
          className={`${inputClass} mt-3 min-h-48 resize-y whitespace-pre leading-relaxed disabled:opacity-70`}
          data-testid="gcode-output"
          id="gcode-output"
          placeholder="Generated output appears here after validation."
          readOnly
          rows={9}
          spellCheck={false}
          value={generated?.output ?? ""}
          wrap="off"
        />
        <p
          aria-live="polite"
          className="mt-2 min-h-5 text-xs text-[var(--muted)]"
          data-testid="gcode-output-status"
        >
          {outputStatus}
        </p>
      </section>
    </section>
  );
}
