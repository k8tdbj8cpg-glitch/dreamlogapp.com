export type HueLightState = {
  on: boolean;
  bri: number;
  hue?: number;
  sat?: number;
  reachable: boolean;
};

export type HueLight = {
  id: string;
  name: string;
  state: HueLightState;
};

export type HueLightUpdate = {
  on?: boolean;
  bri?: number;
  hue?: number;
  sat?: number;
};
