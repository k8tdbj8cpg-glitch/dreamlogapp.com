import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import {
  awardBadge,
  getDreamEntriesByUserId,
  getSleepDataByUserId,
  saveSleepData,
  updateUserStreak,
} from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

const sleepSyncSchema = z.object({
  source: z.enum(["apple_watch", "fitbit", "garmin", "manual"]).default("manual"),
  sleepStart: z.string().datetime(),
  sleepEnd: z.string().datetime(),
  durationMinutes: z.number().int().positive().optional(),
  qualityScore: z.number().min(0).max(10).optional(),
  heartRateAvg: z.number().int().positive().optional(),
  activityData: z.record(z.unknown()).optional(),
});

export type SleepSyncBody = z.infer<typeof sleepSyncSchema>;

/**
 * POST /api/health-sync
 * Sync sleep/health data from Apple Watch (HealthKit), Fitbit, or other wearables.
 * Expects a JSON body matching SleepSyncBody.
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  let body: SleepSyncBody;
  try {
    const json = await request.json();
    body = sleepSyncSchema.parse(json);
  } catch (_) {
    return new ChatbotError("bad_request:api").toResponse();
  }

  const saved = await saveSleepData({
    userId: session.user.id,
    source: body.source,
    sleepStart: new Date(body.sleepStart),
    sleepEnd: new Date(body.sleepEnd),
    durationMinutes: body.durationMinutes,
    qualityScore: body.qualityScore,
    heartRateAvg: body.heartRateAvg,
    activityData: body.activityData,
  });

  // Update streak and check for badges
  const streak = await updateUserStreak({ userId: session.user.id });

  // Award milestone badges
  const badgesAwarded: string[] = [];
  if (streak.totalEntries === 1) {
    await awardBadge({ userId: session.user.id, badgeType: "first_sync" });
    badgesAwarded.push("first_sync");
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
    { sleepData: saved[0], streak, badgesAwarded },
    { status: 201 }
  );
}

/**
 * GET /api/health-sync
 * Retrieve the authenticated user's synced sleep data and dream entries.
 */
export async function GET(_request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:chat").toResponse();
  }

  const [sleepRecords, dreamEntries] = await Promise.all([
    getSleepDataByUserId({ userId: session.user.id }),
    getDreamEntriesByUserId({ userId: session.user.id }),
  ]);

  return Response.json({ sleepData: sleepRecords, dreamEntries });
}
