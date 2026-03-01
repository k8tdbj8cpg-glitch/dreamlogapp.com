"use client";

import cx from "classnames";
import type { HueLight } from "@/lib/hue/types";

const LightBulbIcon = ({
  on,
  size = 24,
}: {
  on: boolean;
  size?: number;
}) => (
  <svg
    fill="none"
    height={size}
    viewBox="0 0 24 24"
    width={size}
    aria-hidden="true"
  >
    <path
      d="M9 21h6M12 3a6 6 0 0 1 4 10.47V17H8v-3.53A6 6 0 0 1 12 3z"
      fill={on ? "currentColor" : "none"}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    />
  </svg>
);

function brightnessPercent(bri: number): number {
  return Math.round((bri / 254) * 100);
}

function LightCard({ light }: { light: HueLight }) {
  const isOn = light.state.on && light.state.reachable;
  const brightness = light.state.bri !== undefined
    ? brightnessPercent(light.state.bri)
    : null;

  return (
    <div
      className={cx(
        "flex items-center gap-3 rounded-xl border p-3 transition-colors",
        {
          "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30":
            isOn,
          "border-border bg-muted/30": !isOn,
          "opacity-50": !light.state.reachable,
        }
      )}
    >
      <div
        className={cx("shrink-0", {
          "text-yellow-500": isOn,
          "text-muted-foreground": !isOn,
        })}
      >
        <LightBulbIcon on={isOn} size={24} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-medium text-sm">{light.name}</div>
        <div className="text-muted-foreground text-xs">
          {!light.state.reachable
            ? "Unreachable"
            : isOn
              ? brightness !== null
                ? `On · ${brightness}% brightness`
                : "On"
              : "Off"}
        </div>
      </div>

      <div
        className={cx(
          "shrink-0 rounded-full px-2 py-0.5 font-medium text-xs",
          {
            "bg-yellow-200 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200":
              isOn,
            "bg-muted text-muted-foreground": !isOn,
          }
        )}
      >
        {isOn ? "On" : "Off"}
      </div>
    </div>
  );
}

export function HueLights({ lights }: { lights: HueLight[] }) {
  if (lights.length === 0) {
    return (
      <div className="rounded-xl border border-border p-4 text-center text-muted-foreground text-sm">
        No Philips Hue lights found.
      </div>
    );
  }

  const onCount = lights.filter(
    (l) => l.state.on && l.state.reachable
  ).length;

  return (
    <div className="flex w-full flex-col gap-2 rounded-2xl border border-border bg-background p-4 shadow-sm">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-semibold text-sm">Philips Hue Lights</span>
        <span className="text-muted-foreground text-xs">
          {onCount} of {lights.length} on
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {lights.map((light) => (
          <LightCard key={light.id} light={light} />
        ))}
      </div>
    </div>
  );
}

export function HueLightControl({
  lightId,
  action,
  result,
}: {
  lightId: string;
  action: string;
  result: { success?: boolean; error?: string };
}) {
  if (result.error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
        {result.error}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 text-sm dark:border-green-800 dark:bg-green-950/30 dark:text-green-400">
      Light {lightId} updated successfully.
    </div>
  );
}
