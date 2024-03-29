import { Barkeep } from "../effects/barkeep/Barkeep.js";
import { BombFX } from "../app/BombFX.js";
import { Chortle } from "../effects/commands/chortle/Chortle.js";
import { Effect } from "../app/Effect.js";
import { Illuminati } from "../effects/illuminati/Illuminati.js";
import { Orb } from "../effects/orb/Orb.js";
import { PantsGrab } from "../effects/commands/pantsgrab/PantsGrab.js";
import { PrimeIntro } from "../effects/misc/primeintro/PrimeIntro.js";
import type { StreamerBotTriggerData } from "../types/StreamerBotTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const streamerBotTriggers: Array<StreamerBotTriggerData> = [
    {
        name: "barkeep",
        action: async (data) => {
            const answer: any = await app.openAI.chat(data.message);
            const effect: Effect = new Barkeep(answer);
            app.queues[effect.queueType].push(effect);
            app.twitch.bot.say(answer);
        }
    }, {
        name: "cfbChortle",
        action: async () => { Chortle.react(); }
    }, {
        name: "dismissOrb",
        action: async () => { Orb.dismiss(); }
    }, {
        name: "Illuminati",
        action: async() => {
            const effect: Effect = new Illuminati();
            app.queues[effect.queueType].push(effect);
        }
    }, {
        name: "PantsGrab",
        action: async () => { PantsGrab.these(); }
    }, {
        name: "PrimeIntro",
        action: async () => { PrimeIntro.switchSceneAndRun(); }
    }, {
        name: "tts",
        action: async (data) => {
            console.log(data);
            const effect: Effect = new Barkeep(data.message);
            app.queues[effect.queueType].push(effect);
        }
    }
];