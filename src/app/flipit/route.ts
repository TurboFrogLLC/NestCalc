import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const FLIPIT_COMPOSITION = path.join(
  process.cwd(),
  "docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html",
);

export async function GET() {
  const compositionBytes = await readFile(FLIPIT_COMPOSITION);
  return new Response(new Uint8Array(compositionBytes), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
