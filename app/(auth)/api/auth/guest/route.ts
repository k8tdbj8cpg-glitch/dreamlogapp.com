import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: Request) {
  let redirectUrl = "/";

  try {
    const { searchParams } = new URL(request.url);
    redirectUrl = searchParams.get("redirectUrl") ?? "/";

    if (!process.env.AUTH_SECRET) {
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
      secureCookie: !isDevelopmentEnvironment,
    });

    if (token) {
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  } catch (error) {
    console.error("[/api/auth/guest] Error checking session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  // Sign in with the guest Credentials provider directly.
  // Using /api/auth/signin/guest is not a valid NextAuth v5 action for
  // Credentials providers and causes "UnknownAction: Unsupported action" errors.
  // Kept outside try/catch so the NEXT_REDIRECT thrown by signIn propagates to Next.js.
  return await signIn("guest", { redirectTo: redirectUrl });
}
