import { spawnSync } from "node:child_process";
import { createSerwistRoute } from "@serwist/turbopack";

const revision =
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID();

const precacheRevision = revision;

export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } =
  createSerwistRoute({
    additionalPrecacheEntries: [
      { url: "/", revision: precacheRevision },
      { url: "/~offline", revision: precacheRevision },
      { url: "/manifest.webmanifest", revision: precacheRevision },
      { url: "/icons/icon-192.png", revision: precacheRevision },
      { url: "/icons/icon-512.png", revision: precacheRevision },
      { url: "/icons/apple-touch-icon.png", revision: precacheRevision },
    ],
    swSrc: "src/app/sw.ts",
    useNativeEsbuild: true,
  });
