"use client";

import { Show, UserButton } from "@clerk/nextjs";
import { nestcalcUserButtonAppearance } from "@/lib/clerkAppearance";

export function AuthControls() {
  return (
    <Show when="signed-in">
      <UserButton
        appearance={{
          ...nestcalcUserButtonAppearance,
          elements: {
            ...nestcalcUserButtonAppearance.elements,
            avatarBox: "h-8 w-8",
          },
        }}
      />
    </Show>
  );
}