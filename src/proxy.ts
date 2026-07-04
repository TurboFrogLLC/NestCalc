import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/~offline"]);

export default clerkMiddleware(
  async (auth, request) => {
    if (request.nextUrl.pathname.startsWith("/sign-up")) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    if (!isPublicRoute(request)) {
      await auth.protect();
    }
  },
  {
    signInUrl: "/sign-in",
  },
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};