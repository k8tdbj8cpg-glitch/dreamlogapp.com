"use client";

import type {
  DreamEntry,
  SleepData,
  UserBadge,
  UserStreak,
} from "@/lib/db/schema";

const MOOD_BORDER_STYLE: Record<string, string> = {
  Peaceful: "border-l-[3px] border-l-green-500",
  Anxious: "border-l-[3px] border-l-pink-500",
  Euphoric: "border-l-[3px] border-l-purple-500",
  Nostalgic: "border-l-[3px] border-l-blue-500",
};

function getMoodBorderClass(mood: string | null | undefined): string {
  if (!mood) {
    return "";
  }
  return MOOD_BORDER_STYLE[mood] ?? "";
}

const BADGE_LABELS: Record<string, { emoji: string; label: string }> = {
  first_dream: { emoji: "🌙", label: "First Dream" },
  first_sync: { emoji: "⌚", label: "First Sync" },
  lucid_dreamer: { emoji: "✨", label: "Lucid Dreamer" },
  week_streak: { emoji: "🔥", label: "7-Day Streak" },
  month_streak: { emoji: "🏆", label: "30-Day Streak" },
};

type Props = {
  sleepData: SleepData[];
  dreamEntries: DreamEntry[];
  streak: UserStreak;
  badges: UserBadge[];
};

function avgSleepHours(records: SleepData[]): string {
  if (records.length === 0) { return "—"; }
  const total = records.reduce((sum, r) => {
    const mins =
      (new Date(r.sleepEnd).getTime() - new Date(r.sleepStart).getTime()) /
      60_000;
    return sum + mins;
  }, 0);
  const avgMins = total / records.length;
  return `${(avgMins / 60).toFixed(1)}h`;
}

function avgQuality(records: SleepData[]): string {
  const scored = records.filter((r) => r.qualityScore !== null && r.qualityScore !== undefined);
  if (scored.length === 0) { return "—"; }
  const avg =
    scored.reduce((s, r) => s + (r.qualityScore as number), 0) / scored.length;
  return avg.toFixed(1);
}

export function DreamDashboard({ sleepData, dreamEntries, streak, badges }: Props) {
  const lucidCount = dreamEntries.filter((d) => d.isLucid).length;
  const sharedCount = dreamEntries.filter((d) => d.isShared).length;

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-4xl mx-auto w-full">
      <h1 className="font-bold text-2xl">🌙 Dream Dashboard</h1>

      {/* Streak & Totals */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard emoji="🔥" label="Current Streak" value={`${streak.currentStreak} days`} />
        <StatCard emoji="🏆" label="Best Streak" value={`${streak.longestStreak} days`} />
        <StatCard emoji="📖" label="Total Logs" value={String(streak.totalEntries)} />
        <StatCard emoji="✨" label="Lucid Dreams" value={String(lucidCount)} />
      </div>

      {/* Sleep Metrics */}
      <section>
        <h2 className="font-semibold text-lg mb-3">
          💤 Sleep Metrics
          {sleepData.length > 0 && ` (last ${sleepData.length} night${sleepData.length !== 1 ? "s" : ""})`}
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard emoji="💤" label="Avg Sleep Duration" value={avgSleepHours(sleepData)} />
          <StatCard emoji="⭐" label="Avg Quality Score" value={avgQuality(sleepData)} />
          <StatCard emoji="🔄" label="Synced Records" value={String(sleepData.length)} />
        </div>
      </section>

      {/* Recent Sleep Records */}
      {sleepData.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-3">📊 Recent Sleep Records</h2>
          <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-900">
                <tr>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Source</th>
                  <th className="px-4 py-2 text-left">Duration</th>
                  <th className="px-4 py-2 text-left">Quality</th>
                  <th className="px-4 py-2 text-left">Heart Rate</th>
                </tr>
              </thead>
              <tbody>
                {sleepData.map((record) => {
                  const start = new Date(record.sleepStart);
                  const durationMins =
                    (new Date(record.sleepEnd).getTime() - start.getTime()) /
                    60_000;
                  return (
                    <tr
                      className="border-t border-zinc-200 dark:border-zinc-800"
                      key={record.id}
                    >
                      <td className="px-4 py-2">
                        {start.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 capitalize">
                        {record.source.replace("_", " ")}
                      </td>
                      <td className="px-4 py-2">
                        {(durationMins / 60).toFixed(1)}h
                      </td>
                      <td className="px-4 py-2">
                        {record.qualityScore ?? "—"}
                      </td>
                      <td className="px-4 py-2">
                        {record.heartRateAvg ? `${record.heartRateAvg} bpm` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Dream Entries */}
      {dreamEntries.length > 0 && (
        <section>
          <h2 className="font-semibold text-lg mb-3">📖 Recent Dream Entries</h2>
          <div className="flex flex-col gap-2">
            {dreamEntries.slice(0, 10).map((entry) => (
              <div
                className={`rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 ${getMoodBorderClass(entry.mood)}`}
                key={entry.id}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">
                    {entry.isLucid && "✨ "}
                    {entry.title}
                  </span>
                  <div className="flex gap-1 text-xs text-zinc-500">
                    {entry.mood && (
                      <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5">
                        {entry.mood}
                      </span>
                    )}
                    {entry.isShared && (
                      <span className="rounded bg-blue-100 dark:bg-blue-900 px-1.5 py-0.5 text-blue-700 dark:text-blue-300">
                        shared
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-sm text-zinc-500 line-clamp-2">
                  {entry.content}
                </p>
                <p className="mt-1 text-xs text-zinc-400">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Badges */}
      <section>
        <h2 className="font-semibold text-lg mb-3">🏅 Achievements</h2>
        {badges.length === 0 ? (
          <p className="text-sm text-zinc-500">
            No badges yet — log your first dream to earn one!
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {badges.map((b) => {
              const meta = BADGE_LABELS[b.badgeType] ?? {
                emoji: "🎖",
                label: b.badgeType,
              };
              return (
                <div
                  className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm"
                  key={b.id}
                >
                  <span>{meta.emoji}</span>
                  <span>{meta.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Shared count note */}
      {sharedCount > 0 && (
        <p className="text-sm text-zinc-500">
          You have shared {sharedCount} dream{sharedCount !== 1 ? "s" : ""} with
          others via private links.
        </p>
      )}
    </div>
  );
}

function StatCard({ emoji, label, value }: { emoji?: string; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4">
      {emoji && <p className="text-2xl mb-1">{emoji}</p>}
      <p className="font-bold text-xl">{value}</p>
      <p className="text-xs text-zinc-500 mt-1">{label}</p>
    </div>
  );
}
