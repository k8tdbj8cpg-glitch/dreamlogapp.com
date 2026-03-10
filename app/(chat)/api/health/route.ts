import { auth } from "@/app/(auth)/auth";
import {
  getHealthSleepRecordsByUserId,
  saveHealthSleepRecord,
} from "@/lib/db/queries";
import { ChatbotError } from "@/lib/errors";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:health").toResponse();
  }

  const records = await getHealthSleepRecordsByUserId({
    userId: session.user.id,
  });

  return Response.json(records);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return new ChatbotError("unauthorized:health").toResponse();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (_) {
    return new ChatbotError("bad_request:health").toResponse();
  }

  if (
    !body ||
    typeof body !== "object" ||
    !("sleepStart" in body) ||
    !("sleepEnd" in body)
  ) {
    return new ChatbotError(
      "bad_request:health",
      "sleepStart and sleepEnd are required"
    ).toResponse();
  }

  const {
    sleepStart,
    sleepEnd,
    source = "apple_health",
    sleepDurationMinutes,
    sleepQuality,
    heartRateAvgBpm,
    heartRateMinBpm,
    heartRateMaxBpm,
  } = body as {
    sleepStart: string;
    sleepEnd: string;
    source?: "apple_health" | "apple_watch" | "manual";
    sleepDurationMinutes?: number;
    sleepQuality?: number;
    heartRateAvgBpm?: number;
    heartRateMinBpm?: number;
    heartRateMaxBpm?: number;
  };

  const validSources = ["apple_health", "apple_watch", "manual"] as const;
  if (!validSources.includes(source)) {
    return new ChatbotError(
      "bad_request:health",
      `source must be one of: ${validSources.join(", ")}`
    ).toResponse();
  }

  const start = new Date(sleepStart);
  const end = new Date(sleepEnd);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return new ChatbotError(
      "bad_request:health",
      "sleepStart and sleepEnd must be valid ISO 8601 timestamps"
    ).toResponse();
  }

  if (end <= start) {
    return new ChatbotError(
      "bad_request:health",
      "sleepEnd must be after sleepStart"
    ).toResponse();
  }

  if (
    sleepQuality != null &&
    (sleepQuality < 0 || sleepQuality > 100 || !Number.isInteger(sleepQuality))
  ) {
    return new ChatbotError(
      "bad_request:health",
      "sleepQuality must be an integer between 0 and 100"
    ).toResponse();
  }

  const [record] = await saveHealthSleepRecord({
    userId: session.user.id,
    source,
    sleepStart: start,
    sleepEnd: end,
    sleepDurationMinutes,
    sleepQuality,
    heartRateAvgBpm,
    heartRateMinBpm,
    heartRateMaxBpm,
  });

  return Response.json(record, { status: 201 });
}
