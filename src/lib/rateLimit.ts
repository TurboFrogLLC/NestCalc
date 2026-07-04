type RateLimitEntry = {
  timestamps: number[];
};

const store = new Map<string, RateLimitEntry>();

const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function pruneExpired(windowMs: number): void {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) {
    return;
  }

  lastCleanup = now;

  for (const [key, entry] of store) {
    entry.timestamps = entry.timestamps.filter((timestamp) => now - timestamp < windowMs);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

export function checkRateLimit(
  key: string,
  maxAttempts: number,
  windowMs: number,
): { limited: boolean } {
  pruneExpired(windowMs);

  const now = Date.now();
  const entry = store.get(key) ?? { timestamps: [] };
  const recent = entry.timestamps.filter((timestamp) => now - timestamp < windowMs);

  if (recent.length >= maxAttempts) {
    store.set(key, { timestamps: recent });
    return { limited: true };
  }

  recent.push(now);
  store.set(key, { timestamps: recent });
  return { limited: false };
}