import { auth } from "@/app/(auth)/auth";
import { getOrCreateUserStreak, getUserBadges } from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

/**
 * GET /api/streaks
 * Returns the authenticated user's current streak, badges, and gamification stats.
 */
export async function GET(_request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const [streak, badges] = await Promise.all([
    getOrCreateUserStreak({ userId: session.user.id }),
    getUserBadges({ userId: session.user.id }),
  ]);

  return Response.json({ streak, badges });
}
