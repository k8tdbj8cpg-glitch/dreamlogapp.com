export const dynamic = 'force-dynamic';
import { signIn } from "@/app/(auth)/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const redirectUrl = searchParams.get("redirectUrl") ?? "/";

    await signIn("guest", { redirect: false });

    return NextResponse.redirect(new URL(redirectUrl, request.url));
  } catch (error) {
    console.error("[/api/auth/guest] Error:", error);
    return NextResponse.redirect(new URL("/login?error=guest", request.url));
  }
}
