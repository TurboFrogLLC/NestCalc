import { NestCalcApp } from "@/components/NestCalcApp";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <NestCalcApp />
    </main>
  );
}