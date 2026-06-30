import { NestCalcApp } from "@/components/NestCalcApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <NestCalcApp />
    </main>
  );
}