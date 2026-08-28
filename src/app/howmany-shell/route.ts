import { readFile } from "node:fs/promises";
import path from "node:path";
import { joinHowManyCountFromFields } from "@/lib/howmany/bridge";
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
    fields?: unknown;
    fieldUnit?: unknown;
    sessionUnit?: unknown;
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

  const totalParts = joinHowManyCountFromFields(
    values,
    isUnit(record.fieldUnit) ? record.fieldUnit : "in",
    isUnit(record.sessionUnit) ? record.sessionUnit : "in",
  );
  return Response.json({ totalParts });
}
