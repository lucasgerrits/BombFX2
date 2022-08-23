import { BombFX } from "../app/BombFX.js";
import { CowReward } from "../effects/cow/Cow.js";
import { hostURLs, webhookURLs } from "./secrets/urls.js";
import { Util } from "../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const streamEventList = {
    start: () => {
        // Pause all rewards (except cow launch)
        app.twitch.rewards.pauseAll();
        CowReward.resume();

        // Mute Alerts overlay
        app.obs.setInputMute("StreamElements", true);

        // Alert the Discord that I've gone live
        const hookURL: string = webhookURLs.announcements;
        const str: string = "Hello again, <@&648942719669895183>! I am programmed to notify you" +
            " every time CFB clicks the Start Streaming button in OBS. The Milk Bar"+
            " is open, friends: https://www.twitch.tv/carefreebomb";
        Util.Requests.webhook(str, hookURL);
    },

    stop: async () => {
        // Post Cow Launch Top 10 to Announcements
        const url: string = hostURLs.cowLeaderboard + "?format=webhook";
        const result = await Util.Requests.makeRequest(url);
        let msg: string = "CFB programmed me to thank you for joining us! Another stream may have ended, but the milk is always on tap.\n\n";
        msg += result.response;
        const hookURL: string = webhookURLs.announcements;
        Util.Requests.webhook(msg, hookURL);
    }
};