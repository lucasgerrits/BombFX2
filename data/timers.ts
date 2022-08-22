import { BombFX } from "../app/BombFX.js";
import { Kona } from "../effects/kona/Kona.js";
import { Util } from "../app/util/Util.js";
import type { TimerData } from "../types/AppTypes.js";

declare var app: BombFX;

export const timers: Array<TimerData> = [
    {
        name: "kona",
        enabled: true,
        interval: Kona.determineInterval(),
        action: async () => {
            Kona.wave();
        }
    }, {
        name: "dice",
        enabled: false,
        interval: Util.Numbers.minToMS(60),
        action: async () => {
            let diceStr: string = "/announce To meet the best " + 
                "followers, viewers, primes, and streamer, tune in " + 
                "to twitch .tv/Dice_The_Vice (remove the space)";
            app.twitch.bot.say(diceStr, true);
        }
    }

];