import { SignIn } from "@clerk/nextjs";
import { RequestAccessForm } from "@/components/RequestAccessForm";
import { nestcalcSignInAppearance } from "@/lib/clerkAppearance";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-4 py-8">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            <span className="text-[var(--foreground)]">Nest</span>
            <span className="text-[var(--quick-value)]">Calc</span>
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
            Private shop-floor tool. Access is by approval only — sign in if you
            already have an account, or request access below.
          </p>
        </header>

        <div className="flex justify-center">
          <SignIn
            forceRedirectUrl="/"
            appearance={nestcalcSignInAppearance}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--card-border)]" />
          <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
            Request access
          </span>
          <div className="h-px flex-1 bg-[var(--card-border)]" />
        </div>

        <section className="rounded-2xl border border-[var(--card-border)] bg-[var(--card)] p-4">
          <p className="mb-4 text-sm text-[var(--muted)]">
            Don&apos;t have access yet? Submit your details and an admin will
            review your request.
          </p>
          <RequestAccessForm />
        </section>
      </div>
    </div>
  );
}