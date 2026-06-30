export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
      <h1 className="text-2xl font-semibold text-[var(--foreground)]">NestCalc</h1>
      <p className="max-w-sm text-[var(--muted)]">
        You are offline and NestCalc has not been cached yet. Open NestCalc once
        while online, then it will keep working from your home screen even when
        the server or tunnel is down.
      </p>
    </main>
  );
}