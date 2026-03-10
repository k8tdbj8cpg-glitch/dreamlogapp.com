CREATE TABLE IF NOT EXISTS "SleepData" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  "source" varchar(64) NOT NULL DEFAULT 'manual',
  "sleepStart" timestamp NOT NULL,
  "sleepEnd" timestamp NOT NULL,
  "durationMinutes" integer,
  "qualityScore" real,
  "heartRateAvg" integer,
  "activityData" json,
  "createdAt" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "DreamEntry" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  "chatId" uuid REFERENCES "Chat"("id"),
  "sleepDataId" uuid REFERENCES "SleepData"("id"),
  "title" text NOT NULL,
  "content" text NOT NULL,
  "mood" varchar(32),
  "tags" json,
  "isShared" boolean NOT NULL DEFAULT false,
  "shareToken" varchar(64),
  "isLucid" boolean NOT NULL DEFAULT false,
  "createdAt" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserStreak" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  "currentStreak" integer NOT NULL DEFAULT 0,
  "longestStreak" integer NOT NULL DEFAULT 0,
  "lastLogDate" timestamp,
  "totalEntries" integer NOT NULL DEFAULT 0,
  "updatedAt" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserBadge" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES "User"("id"),
  "badgeType" varchar(64) NOT NULL,
  "earnedAt" timestamp NOT NULL,
  PRIMARY KEY ("id")
);
