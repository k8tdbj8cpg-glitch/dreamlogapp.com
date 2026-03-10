// Define the HueLight type for representing a smart light.
export type HueLight = {
    id: string; // A unique identifier for the light.
    name: string; // The user-friendly name of the light.
    state: HueLightState; // The current state (on, brightness, color, etc.).
};

// Define the HueLightState type representing the light's state attributes.
export type HueLightState = {
    on: boolean; // Indicates whether the light is turned on or off.
    brightness: number; // A value from 0 to 254 representing the brightness level.
    hue?: number; // Optional: A value representing the hue of the light (color).
    saturation?: number; // Optional: A value from 0 to 254 representing color saturation.
};

// Define the HueLightUpdate type for updating a light's state.
export type HueLightUpdate = Partial<{
    on: boolean; // Turn the light on or off.
    brightness: number; // Set the brightness level.
    hue: number; // Update the hue value (color).
    saturation: number; // Update the saturation level.
}>;