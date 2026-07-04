type RateLimitEntry = {
  windowMs: number;
  timestamps: number[];
};

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function pruneAllExpired(now: number): void {
  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter(
      (timestamp) => now - timestamp < entry.windowMs,
    );
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

function maybeRunPeriodicCleanup(now: number): void {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  lastCleanup = now;
  pruneAllExpired(now);
}

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): { limited: boolean } {
  const now = Date.now();
  maybeRunPeriodicCleanup(now);

  const entry = store.get(key);
  const recent = (entry?.timestamps ?? []).filter(
    (timestamp) => now - timestamp < windowMs,
  );

  if (recent.length >= maxAttempts) {
    store.set(key, { windowMs, timestamps: recent });
    return { limited: true };
  }

  recent.push(now);
  store.set(key, { windowMs, timestamps: recent });
  return { limited: false };
}