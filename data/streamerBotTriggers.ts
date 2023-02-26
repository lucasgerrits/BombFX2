import { Barkeep } from "../effects/barkeep/Barkeep.js";
import { BombFX } from "../app/BombFX.js";
import { Chortle } from "../effects/commands/chortle/Chortle.js";
import { Effect } from "../app/Effect.js";
import { Orb } from "../effects/orb/Orb.js";
import { PantsGrab } from "../effects/commands/pantsgrab/PantsGrab.js";
import type { StreamerBotTriggerData } from "../types/StreamerBotTypes";


// eslint-disable-next-line no-var
declare var app: BombFX;

export const streamerBotTriggers: Array<StreamerBotTriggerData> = [
    {
        name: "cfbChortle",
        action: async () => { Chortle.react(); }
    }, {
        name: "dismissOrb",
        action: async () => { Orb.dismiss(); }
    }, {
        name: "PantsGrab",
        action: async () => { PantsGrab.these(); }
    }, {
        name: "tts",
        action: async (data) => {
            console.log(data);
            const effect: Effect = new Barkeep(data.message);
            app.queues[effect.queueType].push(effect);
        }
    }
];