import "server-only";
import type { HueLight, HueLightState, HueLightUpdate } from "./types";

export type { HueLight, HueLightState, HueLightUpdate };

function getBridgeConfig(): { ip: string; apiKey: string } | null {
  const ip = process.env.HUE_BRIDGE_IP;
  const apiKey = process.env.HUE_API_KEY;
  if (!ip || !apiKey) {
    return null;
  }
  return { ip, apiKey };
}

function bridgeUrl(path: string): string {
  const config = getBridgeConfig();
  if (!config) {
    throw new Error("HUE_BRIDGE_IP and HUE_API_KEY must be configured.");
  }
  return `http://${config.ip}/api/${config.apiKey}${path}`;
}

export async function listLights(): Promise<
  HueLight[] | { error: string }
> {
  const config = getBridgeConfig();
  if (!config) {
    return {
      error:
        "Philips Hue is not configured. Set HUE_BRIDGE_IP and HUE_API_KEY environment variables.",
    };
  }

  try {
    const response = await fetch(bridgeUrl("/lights"));
    if (!response.ok) {
      return { error: `Bridge responded with status ${response.status}.` };
    }
    const data = (await response.json()) as Record<
      string,
      { name: string; state: HueLightState }
    >;

    return Object.entries(data).map(([id, light]) => ({
      id,
      name: light.name,
      state: {
        on: light.state.on,
        bri: light.state.bri,
        hue: light.state.hue,
        sat: light.state.sat,
        reachable: light.state.reachable,
      },
    }));
  } catch (err) {
    return {
      error: `Failed to reach Hue bridge: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function getLightById(
  id: string
): Promise<HueLight | { error: string }> {
  const config = getBridgeConfig();
  if (!config) {
    return {
      error:
        "Philips Hue is not configured. Set HUE_BRIDGE_IP and HUE_API_KEY environment variables.",
    };
  }

  try {
    const response = await fetch(bridgeUrl(`/lights/${id}`));
    if (!response.ok) {
      return { error: `Bridge responded with status ${response.status}.` };
    }
    const data = (await response.json()) as {
      name: string;
      state: HueLightState;
    };
    return {
      id,
      name: data.name,
      state: {
        on: data.state.on,
        bri: data.state.bri,
        hue: data.state.hue,
        sat: data.state.sat,
        reachable: data.state.reachable,
      },
    };
  } catch (err) {
    return {
      error: `Failed to reach Hue bridge: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

export async function setLightState(
  id: string,
  update: HueLightUpdate
): Promise<{ success: true; lightId: string } | { error: string }> {
  const config = getBridgeConfig();
  if (!config) {
    return {
      error:
        "Philips Hue is not configured. Set HUE_BRIDGE_IP and HUE_API_KEY environment variables.",
    };
  }

  try {
    const response = await fetch(bridgeUrl(`/lights/${id}/state`), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(update),
    });
    if (!response.ok) {
      return { error: `Bridge responded with status ${response.status}.` };
    }
    return { success: true, lightId: id };
  } catch (err) {
    return {
      error: `Failed to reach Hue bridge: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
