import { SignUp } from "@clerk/nextjs";
import { nestcalcClerkAppearance } from "@/lib/clerkAppearance";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--background)]">
      <SignUp forceRedirectUrl="/" appearance={nestcalcClerkAppearance} />
    </div>
  );
}