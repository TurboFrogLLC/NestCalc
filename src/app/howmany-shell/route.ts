import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  hydrateHowManyFromGCode,
  joinHowManyNestResultFromFields,
} from "@/lib/howmany/bridge";
import { insetHexNestPart, layoutHexNest } from "@/lib/hexNest";
import type { Unit } from "@/lib/types";

export const runtime = "nodejs";

const CANONICAL_SHELL = path.join(
  process.cwd(),
  "docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html",
);

function isUnit(value: unknown): value is Unit {
  return value === "in" || value === "mm";
}

export async function GET() {
  const canonicalBytes = await readFile(CANONICAL_SHELL);
  return new Response(new Uint8Array(canonicalBytes), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid-json" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "invalid-body" }, { status: 400 });
  }

  const record = body as {
    action?: unknown;
    source?: unknown;
    fields?: unknown;
    fieldUnit?: unknown;
    sessionUnit?: unknown;
    diameter?: unknown;
    partId?: unknown;
    x?: unknown;
    y?: unknown;
  };
  if (!record.fields || typeof record.fields !== "object") {
    return Response.json({ error: "invalid-fields" }, { status: 400 });
  }

  const values: Record<string, string> = {};
  for (const [key, value] of Object.entries(
    record.fields as Record<string, unknown>,
  )) {
    values[key] = value == null ? "" : String(value);
  }

  const fieldUnit = isUnit(record.fieldUnit) ? record.fieldUnit : "in";
  const sessionUnit = isUnit(record.sessionUnit) ? record.sessionUnit : "in";
  if (record.action === "hex-nest-layout" || record.action === "hex-nest-inset") {
    const numberField = (key: string) => Number(values[key]);
    const input = {
      blank: { width: numberField("rem-x"), height: numberField("rem-y") },
      margins: {
        left: numberField("m-left"),
        right: numberField("m-right"),
        top: numberField("m-top"),
        bottom: numberField("m-bottom"),
      },
      diameter: Number(record.diameter),
    };
    try {
      const layout =
        record.action === "hex-nest-inset"
          ? insetHexNestPart(input, {
              partId: typeof record.partId === "string" ? record.partId : "",
              x: Number(record.x),
              y: Number(record.y),
            })
          : layoutHexNest(input);
      return Response.json({ hexNest: layout });
    } catch {
      return Response.json({ error: "invalid-hex-nest" }, { status: 422 });
    }
  }

  if (record.action === "hydrate" || record.action === "analyze") {
    if (typeof record.source !== "string") {
      return Response.json({ error: "invalid-source" }, { status: 400 });
    }

    const hydration = hydrateHowManyFromGCode(
      record.source,
      values,
      fieldUnit,
      sessionUnit,
    );
    if (!hydration.ok) {
      return Response.json(
        { error: "invalid-gcode", diagnostics: hydration.diagnostics },
        { status: 422 },
      );
    }

    if (record.action === "analyze") {
      return Response.json({
        bounds: hydration.bounds,
        unit: hydration.unit,
        partSize: hydration.partSize,
      });
    }

    return Response.json({
      totalParts: hydration.nestResult.totalParts,
      nestResult: hydration.nestResult,
      bounds: hydration.bounds,
      unit: hydration.unit,
      partSize: hydration.partSize,
      blankSize: hydration.blankSize,
    });
  }

  const nestResult = joinHowManyNestResultFromFields(
    values,
    fieldUnit,
    sessionUnit,
  );
  return Response.json({ totalParts: nestResult.totalParts, nestResult });
}
