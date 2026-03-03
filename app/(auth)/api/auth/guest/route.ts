import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { isDevelopmentEnvironment } from "@/lib/constants";
import { signIn } from "@/app/(auth)/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get("redirectUrl") ?? "/";

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

    const signInUrl = new URL("/api/auth/signin/guest", request.url);
    signInUrl.searchParams.set("callbackUrl", redirectUrl);

    return NextResponse.redirect(signInUrl);
  } catch (error) {
    console.error("[/api/auth/guest] Error occurred:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
