import { tool } from "ai";
import { z } from "zod";
import { getLightById, listLights, setLightState } from "@/lib/hue/client";

export const controlHueLights = tool({
  description:
    "Control Philips Hue smart lights. You can list all lights, get a specific light's status, turn lights on or off, or adjust brightness and color.",
  inputSchema: z.object({
    action: z
      .enum(["list", "get", "set"])
      .describe(
        "'list' to show all lights, 'get' to check a specific light, 'set' to change a light's state"
      ),
    lightId: z
      .string()
      .optional()
      .describe("Light ID (required for 'get' and 'set' actions)"),
    on: z.boolean().optional().describe("Turn the light on (true) or off (false)"),
    brightness: z
      .number()
      .min(0)
      .max(100)
      .optional()
      .describe("Brightness percentage (0–100)"),
    hue: z
      .number()
      .min(0)
      .max(65535)
      .optional()
      .describe("Hue color value (0–65535)"),
    saturation: z
      .number()
      .min(0)
      .max(254)
      .optional()
      .describe("Saturation value (0–254)"),
  }),
  execute: async (input) => {
    if (input.action === "list") {
      return listLights();
    }

    if (input.action === "get") {
      if (!input.lightId) {
        return { error: "lightId is required for the 'get' action." };
      }
      return getLightById(input.lightId);
    }

    if (input.action === "set") {
      if (!input.lightId) {
        return { error: "lightId is required for the 'set' action." };
      }
      const update: { on?: boolean; bri?: number; hue?: number; sat?: number } =
        {};
      if (input.on !== undefined) update.on = input.on;
      if (input.brightness !== undefined) {
        // Convert 0–100 percentage to Hue API range 1–254
        update.bri = Math.max(1, Math.round((input.brightness / 100) * 254));
      }
      if (input.hue !== undefined) update.hue = input.hue;
      if (input.saturation !== undefined) update.sat = input.saturation;
      return setLightState(input.lightId, update);
    }

    return { error: "Unknown action." };
  },
});
