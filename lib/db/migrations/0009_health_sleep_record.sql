CREATE TABLE "HealthSleepRecord" (
	"id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"source" varchar NOT NULL DEFAULT 'apple_health',
	"sleepStart" timestamp NOT NULL,
	"sleepEnd" timestamp NOT NULL,
	"sleepDurationMinutes" integer,
	"sleepQuality" integer,
	"heartRateAvgBpm" integer,
	"heartRateMinBpm" integer,
	"heartRateMaxBpm" integer,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "HealthSleepRecord_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action,
	CONSTRAINT "HealthSleepRecord_source_check" CHECK ("source" IN ('apple_health', 'apple_watch', 'manual')),
	CONSTRAINT "HealthSleepRecord_sleepQuality_check" CHECK ("sleepQuality" IS NULL OR ("sleepQuality" >= 0 AND "sleepQuality" <= 100))
);
