"use client";

import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const authBtnClass =
  "min-h-9 rounded-lg border border-[var(--btn-border)] bg-[var(--btn-bg)] px-2.5 py-1.5 text-xs font-semibold transition-colors hover:border-[var(--accent-hover)] hover:bg-[var(--card)]";

export function AuthControls() {
  return (
    <div className="flex items-center gap-1.5">
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button type="button" className={`${authBtnClass} text-[var(--foreground)]`}>
            Sign in
          </button>
        </SignInButton>
        <SignUpButton mode="modal">
          <button
            type="button"
            className={`${authBtnClass} border-[var(--accent-hover)] text-[var(--accent)]`}
          >
            Sign up
          </button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-8 w-8",
            },
          }}
        />
      </Show>
    </div>
  );
}
