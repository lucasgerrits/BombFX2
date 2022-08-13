import { BombFX } from "../../app/BombFX.js";
import { Util } from "../../app/Util.js";
import type { ChatTriggerData } from "../../types/AppTypes";

declare var app: BombFX;

export const counterTriggers: Array<ChatTriggerData> = [
    {
        trigger: "!konabed",
        cooldown: 5,
        action: async (data) => {
            let count: string = await Util.Vars.increment("konaBed");
            let msg: string = "Kona has \"gone to el bedland\" " + count + " times.";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!konadm",
        cooldown: 5,
        action: async (data) => {
            let count: string = await Util.Vars.increment("konaDM");
            let msg: string = "Kona has asked strimmer to check DM's " + count + " times.";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!longstream",
        cooldown: 5,
        action: async (data) => {
            let count: string = await Util.Vars.increment("longStream");
            let msg: string = "We have heard the following: \"You're still streaming???\", " +
                "\"CFB R U OK???\", \"GO TO BED\", and/or \"I woke up and you're still live!\" " + 
                count + " times.";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!tangent",
        cooldown: 5,
        action: async (data) => {
            let count: string = await Util.Vars.increment("tangents");
            let msg: string = "We have been off the rails " + count + " times baby!";
            app.twitch.bot.say(msg);
        }
    }
];
