"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { nestcalcClerkAppearance } from "@/lib/clerkAppearance";

export function AuthControls() {
  return (
    <Show when="signed-in">
      <UserButton
        appearance={{
          ...nestcalcClerkAppearance,
          elements: {
            avatarBox: "h-8 w-8",
          },
        }}
      />
    </Show>
  );
}