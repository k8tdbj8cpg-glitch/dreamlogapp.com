"use client";

import { useState } from "react";

export type SleepEntry = {
  date: string;
  hoursSlept: number;
  quality: "excellent" | "good" | "average" | "poor";
};

export type SleepChartsData = {
  entries: SleepEntry[];
  dateRange: "7days" | "30days";
};

const QUALITY_COLORS = {
  excellent: "#6ee7b7",
  good: "#93c5fd",
  average: "#fcd34d",
  poor: "#fca5a5",
};

const QUALITY_LABELS: Record<string, string> = {
  excellent: "Excellent",
  good: "Good",
  average: "Average",
  poor: "Poor",
};

function SleepQualityPieChart({
  entries,
  dateRange,
  onDateRangeChange,
}: {
  entries: SleepEntry[];
  dateRange: "7days" | "30days";
  onDateRangeChange: (range: "7days" | "30days") => void;
}) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (dateRange === "7days" ? 7 : 30));

  const filtered = entries.filter((e) => new Date(e.date) >= cutoff);

  const counts: Record<string, number> = {
    excellent: 0,
    good: 0,
    average: 0,
    poor: 0,
  };
  for (const e of filtered) {
    counts[e.quality] = (counts[e.quality] ?? 0) + 1;
  }

  const total = filtered.length;
  const cx = 80;
  const cy = 80;
  const r = 64;

  const slices: Array<{
    key: string;
    startAngle: number;
    endAngle: number;
    color: string;
    count: number;
    percent: string;
  }> = [];

  let currentAngle = -Math.PI / 2;
  for (const key of ["excellent", "good", "average", "poor"] as const) {
    const count = counts[key];
    if (count === 0) {
      continue;
    }
    const angle = (count / (total || 1)) * 2 * Math.PI;
    const percent = ((count / (total || 1)) * 100).toFixed(1);
    slices.push({
      key,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: QUALITY_COLORS[key],
      count,
      percent,
    });
    currentAngle += angle;
  }

  function polarToCartesian(angle: number, radius: number) {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  }

  function describeSlice(startAngle: number, endAngle: number) {
    const start = polarToCartesian(startAngle, r);
    const end = polarToCartesian(endAngle, r);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm">Sleep Quality Distribution</h3>
        <div className="flex gap-1">
          {(["7days", "30days"] as const).map((range) => (
            <button
              className={`rounded-full px-2 py-0.5 text-xs transition-colors ${
                dateRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              key={range}
              onClick={() => onDateRangeChange(range)}
              type="button"
            >
              {range === "7days" ? "7 days" : "30 days"}
            </button>
          ))}
        </div>
      </div>

      {total === 0 ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
          No sleep entries in this period
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <svg
            aria-label="Sleep quality distribution pie chart"
            className="overflow-visible"
            height={160}
            role="img"
            viewBox="0 0 160 160"
            width={160}
          >
            {slices.map((slice) => {
              const midAngle = (slice.startAngle + slice.endAngle) / 2;
              const labelR = r * 0.65;
              const labelPos = polarToCartesian(midAngle, labelR);
              const label = QUALITY_LABELS[slice.key] ?? slice.key;
              return (
                <g key={slice.key}>
                  <title>{`${label}: ${slice.count} nights (${slice.percent}%)`}</title>
                  <path
                    d={describeSlice(slice.startAngle, slice.endAngle)}
                    fill={slice.color}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                  {Number(slice.percent) > 8 && (
                    <text
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="9"
                      fontWeight="600"
                      pointerEvents="none"
                      textAnchor="middle"
                      x={labelPos.x}
                      y={labelPos.y}
                    >
                      {slice.percent}%
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="flex flex-col gap-1.5">
            {slices.map((slice) => (
              <div className="flex items-center gap-2" key={slice.key}>
                <div
                  className="size-3 shrink-0 rounded-sm"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-muted-foreground text-xs">
                  {QUALITY_LABELS[slice.key] ?? slice.key}
                </span>
                <span className="ml-auto font-medium text-xs">
                  {slice.count}
                </span>
              </div>
            ))}
            <div className="mt-1 border-t pt-1 text-muted-foreground text-xs">
              Total: {total} night{total !== 1 ? "s" : ""}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SleepDurationBarChart({ entries }: { entries: SleepEntry[] }) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);

  const last7 = entries
    .filter((e) => new Date(e.date) >= cutoff)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-7);

  const maxHours = Math.max(...last7.map((e) => e.hoursSlept), 8);
  const chartH = 100;
  const chartW = 240;
  const barGap = 4;
  const barW =
    last7.length > 0 ? (chartW - barGap) / last7.length - barGap : 28;

  function parseDate(dateStr: string) {
    return new Date(`${dateStr}T00:00:00`);
  }

  function formatDate(dateStr: string) {
    return parseDate(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "numeric",
      day: "numeric",
    });
  }

  function formatShortDate(dateStr: string) {
    return parseDate(dateStr).toLocaleDateString("en-US", { weekday: "short" });
  }

  return (
    <div className="flex flex-col gap-3">
      <h3 className="font-semibold text-sm">Sleep Duration — Last 7 Days</h3>

      {last7.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
          No sleep entries in the last 7 days
        </div>
      ) : (
        <svg
          aria-label="Sleep duration bar chart for the last 7 days"
          className="w-full overflow-visible"
          role="img"
          viewBox={`0 0 ${chartW} ${chartH + 28}`}
        >
          {[0, 2, 4, 6, 8].map((h) => {
            if (h > maxHours) {
              return null;
            }
            const y = chartH - (h / maxHours) * chartH;
            return (
              <g key={h}>
                <line
                  stroke="currentColor"
                  strokeDasharray="2,3"
                  strokeOpacity="0.15"
                  strokeWidth="1"
                  x1="0"
                  x2={chartW}
                  y1={y}
                  y2={y}
                />
                <text
                  dominantBaseline="middle"
                  fill="currentColor"
                  fillOpacity="0.5"
                  fontSize="7"
                  textAnchor="end"
                  x="-3"
                  y={y}
                >
                  {h}h
                </text>
              </g>
            );
          })}

          {last7.map((entry, i) => {
            const barH = (entry.hoursSlept / maxHours) * chartH;
            const x = i * (barW + barGap) + barGap;
            const y = chartH - barH;
            const color = QUALITY_COLORS[entry.quality];
            const shortDate = formatShortDate(entry.date);
            const label = QUALITY_LABELS[entry.quality] ?? entry.quality;

            return (
              <g key={entry.date}>
                <title>{`${formatDate(entry.date)}: ${entry.hoursSlept}h, Quality: ${label}`}</title>
                <rect
                  fill={color}
                  height={barH}
                  rx="3"
                  width={barW}
                  x={x}
                  y={y}
                />
                <text
                  dominantBaseline="hanging"
                  fill="currentColor"
                  fillOpacity="0.6"
                  fontSize="7"
                  textAnchor="middle"
                  x={x + barW / 2}
                  y={chartH + 4}
                >
                  {shortDate}
                </text>
              </g>
            );
          })}

          <line
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="1"
            x1="0"
            x2={chartW}
            y1={chartH}
            y2={chartH}
          />
        </svg>
      )}
    </div>
  );
}

export function SleepCharts({ data }: { data: SleepChartsData }) {
  const [dateRange, setDateRange] = useState<"7days" | "30days">(
    data.dateRange ?? "7days"
  );

  return (
    <div className="flex w-full flex-col gap-5 rounded-2xl border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-lg">🌙</span>
        <h2 className="font-semibold text-base">Sleep Analytics</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <SleepQualityPieChart
          dateRange={dateRange}
          entries={data.entries}
          onDateRangeChange={setDateRange}
        />
        <SleepDurationBarChart entries={data.entries} />
      </div>
    </div>
  );
}
