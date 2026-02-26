import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  awardBadge,
  getDreamEntriesByUserId,
  saveDreamEntry,
  updateUserStreak,
} from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";
import { generateUUID } from "@/lib/utils";

const dreamEntrySchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  chatId: z.string().uuid().optional(),
  sleepDataId: z.string().uuid().optional(),
  mood: z.string().max(32).optional(),
  tags: z.array(z.string().max(32)).optional(),
  isLucid: z.boolean().optional(),
  isShared: z.boolean().optional(),
});

export type DreamEntryBody = z.infer<typeof dreamEntrySchema>;

/**
 * POST /api/dreams
 * Save a dream entry and update the user's streak.
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  let body: DreamEntryBody;
  try {
    const json = await request.json();
    body = dreamEntrySchema.parse(json);
  } catch (_) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const shareToken = body.isShared ? generateUUID() : undefined;

  const saved = await saveDreamEntry({
    userId: session.user.id,
    title: body.title,
    content: body.content,
    chatId: body.chatId,
    sleepDataId: body.sleepDataId,
    mood: body.mood,
    tags: body.tags,
    isLucid: body.isLucid,
    isShared: body.isShared,
    shareToken,
  });

  const entry = saved[0];

  // Update streak and check for badges
  const streak = await updateUserStreak({ userId: session.user.id });

  const badgesAwarded: string[] = [];
  if (streak.totalEntries === 1) {
    await awardBadge({ userId: session.user.id, badgeType: "first_dream" });
    badgesAwarded.push("first_dream");
  }
  if (body.isLucid) {
    await awardBadge({ userId: session.user.id, badgeType: "lucid_dreamer" });
    badgesAwarded.push("lucid_dreamer");
  }
  if (streak.currentStreak >= 7) {
    await awardBadge({ userId: session.user.id, badgeType: "week_streak" });
    badgesAwarded.push("week_streak");
  }
  if (streak.currentStreak >= 30) {
    await awardBadge({ userId: session.user.id, badgeType: "month_streak" });
    badgesAwarded.push("month_streak");
  }

  return Response.json(
    {
      dreamEntry: entry,
      streak,
      badgesAwarded,
    },
    { status: 201 }
  );
}

/**
 * GET /api/dreams
 * Returns the authenticated user's dream entries.
 */
export async function GET(_request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const entries = await getDreamEntriesByUserId({ userId: session.user.id });
  return Response.json({ dreamEntries: entries });
}
