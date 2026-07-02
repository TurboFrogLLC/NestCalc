import { SignIn } from "@clerk/nextjs";
import { nestcalcClerkAppearance } from "@/lib/clerkAppearance";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <SignIn forceRedirectUrl="/" appearance={nestcalcClerkAppearance} />
    </div>
  );
}