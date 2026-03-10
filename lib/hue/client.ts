import type { HueLight, HueLightUpdate } from "./types";

const HUE_BRIDGE_IP = process.env.HUE_BRIDGE_IP;
const HUE_API_KEY = process.env.HUE_API_KEY;

if (!HUE_BRIDGE_IP || !HUE_API_KEY) {
    throw new Error("Environment variables HUE_BRIDGE_IP and HUE_API_KEY must be set");
}

/**
 * List all available lights connected to the Philips Hue Bridge.
 * @returns Array of HueLight objects or an error object.
 */
export async function listLights(): Promise<HueLight[] | { error: string }> {
    try {
        const response = await fetch(`http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights`);
        if (!response.ok) {
            return { error: `Request failed with status ${response.status}` };
        }
        const data = await response.json();
        const lights: HueLight[] = Object.entries(data).map(([id, light]: [string, unknown]) => {
            const lightData = light as Record<string, unknown>;
            const state = lightData.state as Record<string, unknown>;
            return {
                id,
                name: lightData.name as string,
                state: {
                    on: state.on as boolean,
                    brightness: state.bri as number,
                    hue: state.hue as number,
                    saturation: state.sat as number,
                },
            };
        });
        return lights;
    } catch (error) {
        return { error: error instanceof Error ? error.message : "Failed to fetch lights" };
    }
}

/**
 * Get detailed information about a specific light by ID.
 * @param id ID of the light to retrieve.
 * @returns A HueLight object or an error object.
 */
export async function getLightById(id: string): Promise<HueLight | { error: string }> {
    try {
        const response = await fetch(`http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights/${id}`);
        if (!response.ok) {
            return { error: `Request failed with status ${response.status}` };
        }
        const light = await response.json() as Record<string, unknown>;
        const state = light.state as Record<string, unknown>;
        return {
            id,
            name: light.name as string,
            state: {
                on: state.on as boolean,
                brightness: state.bri as number,
                hue: state.hue as number,
                saturation: state.sat as number,
            },
        };
    } catch (error) {
        return { error: error instanceof Error ? error.message : `Failed to fetch light with ID ${id}` };
    }
}

/**
 * Update the state of a specific light by ID.
 * @param id ID of the light to update.
 * @param state Partial state updates for the light.
 * @returns The updated state or an error object.
 */
export async function setLightState(id: string, state: HueLightUpdate): Promise<{ success: boolean } | { error: string }> {
    try {
        const response = await fetch(`http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights/${id}/state`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(state),
        });
        if (!response.ok) {
            return { error: `Request failed with status ${response.status}` };
        }
        return { success: true };
    } catch (error) {
        return { error: error instanceof Error ? error.message : `Failed to update light with ID ${id}` };
    }
}