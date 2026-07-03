"use client";

import { useActionState } from "react";
import {
  submitAccessRequest,
  type AccessRequestState,
} from "@/app/actions/requestAccess";

const inputClass =
  "w-full rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--input-text)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]";

const labelClass =
  "mb-1 block text-xs font-medium uppercase tracking-wider text-[var(--muted)]";

export function RequestAccessForm() {
  const [state, formAction, pending] = useActionState<
    AccessRequestState | null,
    FormData
  >(submitAccessRequest, null);

  if (state?.ok) {
    return (
      <div
        className="rounded-xl border border-[var(--quick-value-border)] bg-[var(--card)] px-4 py-5 text-center"
        role="status"
      >
        <p className="text-sm font-semibold text-[var(--foreground)]">
          Request received.
        </p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          You&apos;ll be contacted shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <div>
        <label htmlFor="access-name" className={labelClass}>
          Full name
        </label>
        <input
          id="access-name"
          name="name"
          type="text"
          required
          minLength={2}
          autoComplete="name"
          className={inputClass}
          placeholder="Jane Smith"
        />
      </div>

      <div>
        <label htmlFor="access-email" className={labelClass}>
          Email address
        </label>
        <input
          id="access-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
          placeholder="jane@shop.example"
        />
      </div>

      <div>
        <label htmlFor="access-reason" className={labelClass}>
          Reason for request
        </label>
        <textarea
          id="access-reason"
          name="reason"
          required
          minLength={10}
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="Briefly describe your role and why you need access to NestCalc."
        />
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-red-400" role="alert">
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-[var(--accent)] bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--background)] transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
      >
        {pending ? "Sending…" : "Submit request"}
      </button>
    </form>
  );
}