import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { signIn } from "@/app/(auth)/auth";
import { isDevelopmentEnvironment } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const _redirectUrl = searchParams.get("redirectUrl") || "/";

    // Validate Environment Variables
    if (!process.env.AUTH_SECRET) {
      console.error("[/api/auth/guest] AUTH_SECRET is not set");
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
      console.log(
        "[/api/auth/guest] User already authenticated, redirecting..."
      );
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log("[/api/auth/guest] Attempting guest sign-in...");
    return await signIn("guest", { redirect: true, redirectTo: "/login" }); // Updated alignment with `authConfig`
  } catch (error) {
    console.error(
      "[/api/auth/guest] Error occurred:",
      (error as Error).message
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}