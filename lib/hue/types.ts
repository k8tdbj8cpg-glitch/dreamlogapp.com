export interface HueLight {
  id: string;
  name: string;
  state: HueLightState;
}

export interface HueLightState {
  on: boolean;
  bri: number;
  hue?: number;
  sat?: number;
  ct?: number;
}

export interface HueLightUpdate {
  on?: boolean;
  bri?: number;
  hue?: number;
  sat?: number;
  ct?: number;
}