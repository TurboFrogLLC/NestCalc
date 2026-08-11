import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const CANONICAL_SHELL = path.join(
  process.cwd(),
  "docs/nestcalc-ui-redesign-package/REFERENCE-PROTOTYPE-v2.html",
);

export async function GET() {
  const canonicalBytes = await readFile(CANONICAL_SHELL);
  return new Response(new Uint8Array(canonicalBytes), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
