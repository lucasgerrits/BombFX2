import { BombFX } from "../../app/BombFX.js";
import { UserLevel } from "../../app/Enums.js";
import { Util } from "../../app/util/Util.js";
import type { ChatTriggerData } from "../../types/AppTypes";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const counterTriggers: Array<ChatTriggerData> = [
    {
        trigger: "!cfbifeelobligatedtotellyouthatigottalurkbecausespoilers",
        cooldown: 5,
        action: async (data) => {
            const count: string = await Util.Vars.increment("spoilerslurk");
            const msg: string = "Chat has felt obligated to tell CFB that they gotta lurk" +
                " because of spoilers " + count + " times.";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!howisit",
        cooldown: 5,
        action: async(data) => {
            const count: string = await Util.Vars.increment("howisit");
            const msg: string = "CFB has been asked how the game is / how he likes it " +
                count + " times.";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!longstream",
        cooldown: 5,
        action: async (data) => {
            const count: string = await Util.Vars.increment("longStream");
            const msg: string = "We have heard the following: \"You're still streaming???\", " +
                "\"CFB R U OK???\", \"GO TO BED\", and/or \"I woke up and you're still live!\" " + 
                count + " times.";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!majora",
        cooldown: 5,
        action: async (data) => {
            const count: string = await Util.Vars.increment("majora");
            const msg: string = "CFB has failed hitless + maskless Majora " + count + " times. Pohg";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!tangent",
        cooldown: 5,
        action: async (data) => {
            const count: string = await Util.Vars.increment("tangents");
            const msg: string = "We have been off the rails " + count + " times baby!";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!undyne",
        userLevel: UserLevel.Broadcaster,
        cooldown: 5,
        action: async (data) => {
            const count: string = await Util.Vars.increment("undyne");
            const msg: string = "CFB has failed at murdering Undyne " + count + " times, " +
                "he remains filled with... Determination.";
            app.twitch.bot.say(msg);
        }
    }
];
