import { Barkeep } from "../effects/barkeep/Barkeep.js";
import { BombFX } from "../app/BombFX.js";
import { Effect } from "../app/Effect.js";
import { Orb } from "../effects/orb/Orb.js";
import { PantsGrab } from "../effects/commands/pantsgrab/PantsGrab.js";
import type { StreamerBotTriggerData } from "../types/StreamerBotTypes";

declare var app: BombFX;

export const streamerBotTriggers: Array<StreamerBotTriggerData> = [
    {
        name: "dismissOrb",
        action: async () => { Orb.dismiss(); }
    },
    {
        name: "PantsGrab",
        action: async () => { PantsGrab.these(); }
    },
    {
        name: "tts",
        action: async (data) => {
            console.log(data);
            let effect: Effect = new Barkeep(data.message);
            app.queues[effect.queueType].push(effect);
        }
    }
];