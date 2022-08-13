import { BombFX } from "../app/BombFX.js";
import { CowReward } from "../effects/cow/Cow.js";
import { Util } from "../app/Util.js";
import { webhookURLs } from "./webhookURLs.js";

declare var app: BombFX;

export const streamEventList = {
    start: () => {
        // Pause all rewards (except cow launch)
        app.twitch.rewards.pauseAll();
        CowReward.resume();

        // Mute Alerts overlay
        app.obs.send("SetMute", { "source" : "StreamElements", "mute" : true });

        // Alert the Discord that I've gone live
        let hookURL: string = webhookURLs.announcements;
        let str: string = "Hello again, <@&648942719669895183>! I am programmed to notify you" +
            " every time CFB clicks the Start Streaming button in OBS. The Milk Bar"+
            " is open, friends: https://www.twitch.tv/carefreebomb";
        Util.Web.webhook(str, hookURL);
    },

    stop: async () => {
        // Post Cow Launch Top 10 to Announcements
        let result = await Util.Web.makeRequest("https://www.carefreebomb.com/cows/leaderboard.php?format=webhook");
        let msg: string = "CFB programmed me to thank you for joining us! Another stream may have ended, but the milk is always on tap.\n\n";
        msg += result.response;
        let hookURL: string = webhookURLs.announcements;
        Util.Web.webhook(msg, hookURL);
    }
};