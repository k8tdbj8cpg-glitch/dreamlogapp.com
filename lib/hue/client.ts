import axios from "axios";
import { HueLight, HueLightState, HueLightUpdate } from "./types";

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
        const response = await axios.get(`http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights`);
        const lights: HueLight[] = Object.entries(response.data).map(([id, light]: [string, any]) => ({
            id,
            name: light.name,
            state: {
                on: light.state.on,
                brightness: light.state.bri,
                hue: light.state.hue,
                saturation: light.state.sat,
            },
        }));
        return lights;
    } catch (error: any) {
        return { error: error.message || "Failed to fetch lights" };
    }
}

/**
 * Get detailed information about a specific light by ID.
 * @param id ID of the light to retrieve.
 * @returns A HueLight object or an error object.
 */
export async function getLightById(id: string): Promise<HueLight | { error: string }> {
    try {
        const response = await axios.get(`http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights/${id}`);
        const light = response.data;
        return {
            id,
            name: light.name,
            state: {
                on: light.state.on,
                brightness: light.state.bri,
                hue: light.state.hue,
                saturation: light.state.sat,
            },
        };
    } catch (error: any) {
        return { error: error.message || `Failed to fetch light with ID ${id}` };
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
        await axios.put(`http://${HUE_BRIDGE_IP}/api/${HUE_API_KEY}/lights/${id}/state`, state);
        return { success: true };
    } catch (error: any) {
        return { error: error.message || `Failed to update light with ID ${id}` };
    }
}