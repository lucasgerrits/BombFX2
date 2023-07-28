import { BombFX } from "../app/BombFX.js";
import { Kona } from "../effects/kona/Kona.js";
import { Util } from "../app/util/Util.js";
import type { TimerData } from "../types/AppTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const timers: Array<TimerData> = [
    {
        name: "kona",
        isEnabled: false,
        interval: Kona.determineInterval(),
        action: async () => {
            Kona.wave();
        }
    }, {
        name: "dice",
        isEnabled: false,
        interval: Util.Numbers.minToMS(60),
        action: async () => {
            const diceStr: string = "/announce To meet the best " + 
                "followers, viewers, primes, and streamer, tune in " + 
                "to twitch .tv/Dice_The_Vice (remove the space)";
            app.twitch.bot.say(diceStr, true);
        }
    }, {
        name: "weather",
        isEnabled: false,
        interval: Util.Numbers.minToMS(20),
        action: async () => {
            app.obs.refreshBrowserSource("Google Weather Result");
            app.twitch.bot.say("Hey, CFB, I refreshed the weather result.");
        }
    }

];