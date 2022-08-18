import { BombFX } from "../app/BombFX.js";
import { PantsGrab } from "../effects/commands/pantsgrab/PantsGrab.js";
import type { StreamerBotTriggerData } from "../types/StreamerBotTypes";

declare var app: BombFX;

export const streamerBotTriggers: Array<StreamerBotTriggerData> = [
    {
        name: "PantsGrab",
        action: async () => {
            PantsGrab.these();
        }
    },
    {
        name: "tts",
        action: async (data) => {
            console.log(data);
            app.tts.say(data.message);
        }
    }
];