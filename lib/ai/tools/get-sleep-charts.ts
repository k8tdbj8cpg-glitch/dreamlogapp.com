import { tool } from "ai";
import type { Session } from "next-auth";
import { z } from "zod";
import { getSleepDataByUserId } from "@/lib/db/queries";

/** Maps a numeric quality score (0–10) to a descriptive quality label. */
function mapQualityScore(
  score: number | null | undefined
): "excellent" | "good" | "average" | "poor" {
  if (score == null) {
    return "average";
  }
  if (score >= 8) {
    return "excellent";
  }
  if (score >= 6) {
    return "good";
  }
  if (score >= 4) {
    return "average";
  }
  return "poor";
}

type GetSleepChartsProps = {
  session: Session;
};

/**
 * Factory that creates the getSleepCharts AI tool with access to the
 * authenticated user's session so the execute function can fetch their
 * sleep records from the database.
 */
export const getSleepCharts = ({ session }: GetSleepChartsProps) =>
  tool({
    description:
      "Display interactive sleep analytics charts including a pie chart for sleep quality distribution and a bar chart for nightly sleep duration over the last 7 days. Use this when the user asks about their sleep data, patterns, or wants to visualize sleep stats.",
    inputSchema: z.object({
      dateRange: z
        .enum(["7days", "30days"])
        .default("7days")
        .describe(
          "Default date range for the quality pie chart: '7days' or '30days'"
        ),
    }),
    execute: async ({ dateRange }) => {
      // Determine how many records to fetch based on the requested date range
      const limit = dateRange === "30days" ? 30 : 7;

      // Fetch the user's sleep records from the database
      const records = await getSleepDataByUserId({
        userId: session.user.id,
        limit,
      });

      // Map database records to the entries format expected by the chart component
      const mappedEntries = records.map((record) => {
        // Derive the date string from the sleep-start timestamp (YYYY-MM-DD)
        const date = record.sleepStart.toISOString().slice(0, 10);

        // Calculate hours slept from durationMinutes if available, otherwise
        // fall back to the difference between sleepEnd and sleepStart
        const hoursSlept =
          record.durationMinutes != null
            ? record.durationMinutes / 60
            : (record.sleepEnd.getTime() - record.sleepStart.getTime()) /
              (1000 * 60 * 60);

        const quality = mapQualityScore(record.qualityScore);

        return { date, hoursSlept, quality };
      });

      return { entries: mappedEntries, dateRange };
    },
  });
