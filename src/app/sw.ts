/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { defaultCache } from "@serwist/turbopack/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const isDocumentNavigation = ({ request }: { request: Request }) =>
  request.mode === "navigate" || request.destination === "document";

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  // Navigation preload can delay offline fallbacks on iOS when the origin is unreachable.
  navigationPreload: false,
  precacheOptions: {
    navigateFallback: "/",
    navigateFallbackDenylist: [/^\/serwist\//, /^\/api\//, /^\/~offline/],
  },
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/",
        matcher: isDocumentNavigation,
      },
      {
        url: "/~offline",
        matcher: isDocumentNavigation,
      },
    ],
  },
});

serwist.addEventListeners();