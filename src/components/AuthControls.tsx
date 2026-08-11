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
            rootBox: { width: "2rem", height: "2rem" },
            userButtonBox: { width: "2rem", height: "2rem" },
            userButtonTrigger: { width: "2rem", height: "2rem" },
            avatarBox: {
              width: "2rem",
              height: "2rem",
              overflow: "hidden",
              borderRadius: "9999px",
            },
            avatarImage: { width: "2rem", height: "2rem" },
            userButtonAvatarBox: {
              width: "2rem",
              height: "2rem",
              overflow: "hidden",
              borderRadius: "9999px",
            },
            userButtonAvatarImage: { width: "2rem", height: "2rem" },
          },
        }}
      />
    </Show>
  );
}
