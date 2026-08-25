import { readFile } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

// Temporary R14 phone-preview wiring for this branch only; not the product canonical shell.
const R14_PHONE_PREVIEW = path.join(
  process.cwd(),
  "docs/howmany-v3-components/COMPOSITION-FLIPIT-v3.html",
);

export async function GET() {
  const previewBytes = await readFile(R14_PHONE_PREVIEW);
  return new Response(new Uint8Array(previewBytes), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
