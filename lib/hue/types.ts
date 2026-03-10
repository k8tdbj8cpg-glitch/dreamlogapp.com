export interface HueLightState {
    on: boolean;
    brightness: number;
    hue: number;
    saturation: number;
}

export interface HueLight {
    id: string;
    name: string;
    state: HueLightState;
}

/** Uses Philips Hue API field names (bri, sat) for direct bridge compatibility. */
export interface HueLightUpdate {
    on?: boolean;
    /** Brightness (0–254), maps to `bri` in the Hue API. */
    bri?: number;
    hue?: number;
    /** Saturation (0–254), maps to `sat` in the Hue API. */
    sat?: number;
}
