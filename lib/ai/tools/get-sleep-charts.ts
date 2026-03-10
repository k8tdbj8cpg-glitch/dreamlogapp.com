import { tool } from "ai";
import { z } from "zod";

const sleepEntrySchema = z.object({
  date: z.string().describe("Date in YYYY-MM-DD format"),
  hoursSlept: z.number().min(0).max(24).describe("Hours of sleep"),
  quality: z
    .enum(["excellent", "good", "average", "poor"])
    .describe("Sleep quality rating"),
});

export const getSleepCharts = tool({
  description:
    "Display interactive sleep analytics charts including a pie chart for sleep quality distribution and a bar chart for nightly sleep duration over the last 7 days. Use this when the user asks about their sleep data, patterns, or wants to visualize sleep stats.",
  inputSchema: z.object({
    entries: z
      .array(sleepEntrySchema)
      .describe("Sleep log entries to visualize"),
    dateRange: z
      .enum(["7days", "30days"])
      .default("7days")
      .describe(
        "Default date range for the quality pie chart: '7days' or '30days'"
      ),
  }),
  execute: ({ entries, dateRange }) => {
    return Promise.resolve({ entries, dateRange });
  },
});
