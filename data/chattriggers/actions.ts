import { Barkeep } from "../../effects/barkeep/Barkeep.js";
import { BombFX } from "../../app/BombFX.js";
import { ChatEventTriggerData } from "../../app/EventTriggerData.js";
import { Effect } from "../../app/Effect.js";
import { EventTriggerData } from '../../app/EventTriggerData.js';
import { hostURLs, webhookURLs } from "../secrets/urls.js";
import { JamBreak } from "../../effects/jambreak/JamBreak.js";
import { PantsGrab } from "../../effects/commands/pantsgrab/PantsGrab.js";
import { Pineapple } from "../../effects/commands/pineapple/Pineapple.js";
import { Spray } from "../../effects/commands/spray/Spray.js";
import { streamEventList } from "../streamEventList.js";
import { UserLevel } from '../../app/Enums.js';
import { Util } from "../../app/Util.js";
import type { ChatTriggerData } from "../../types/AppTypes";
import type { CommandEventData } from "../../types/ComfyTypes.js";

declare var app: BombFX;

export const actionTriggers: Array<ChatTriggerData> = [
    {
        trigger: "!barkeep",
        userLevel: UserLevel.Broadcaster,
        action: async (data) => {
            let effect: Effect = new Barkeep();
            effect.setTriggerData(new ChatEventTriggerData(data));
            app.queues[effect.queueType].push(effect);
        }
    }, {
        trigger: "!cat",
        cooldown: 5,
        userLevel: UserLevel.VIP,
        action: async () => { app.obs.showFilter("Webcam", "Cat Zoom In"); }
    }, {
        trigger: "!uncat",
        cooldown: 5,
        userLevel: UserLevel.VIP,
        action: async () => { app.obs.showFilter("Webcam", "Cat Zoom Out"); }
    }, {
        trigger: "!cows",
        action: async(data) => {
            let userToCheck: string = data.user;
            if (data.message !== "") {
                userToCheck = data.message;
            }
            let url: string = hostURLs.getCowLaunchCount + "?user=" + userToCheck;
            let result: any = await Util.Web.makeRequest(url);
            let msg: string = result.response;
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "dead rising 2",
        aliases: ["Dead Rising 2", "Dead rising 2"],
        action: async (data) => {
            app.twitch.chat.deleteMessage(data.extra.id);
            app.twitch.bot.say("carefr3Stare", true);
        }
    }, {
        trigger: "!followage",
        action: async (data) => {
            let userToCheck: string = data.user;
            if (data.message !== "") {
                userToCheck = data.message;
            }
            let url: string = "https://api.2g.be/twitch/followage/carefreebomb/" + userToCheck +
                "?format=mwdhms";
            let result: any = await Util.Web.makeRequest(url);
            let msg: string = result.response.replace("CareFreeBomb ", "") + ".";
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!goals",
        aliases: ["!shillmonth", "!shill"],
        cooldown: 15,
        action: async (data) => {
            await app.obs.showSource("SHILL MONTH", "** Mega Overlay");
            await Util.sleep(10000);
            await app.obs.hideSource("SHILL MONTH", "** Mega Overlay");
        }
    }, {
        trigger: "its him",
        aliases: ["it's him"],
        cooldown: 60,
        announceCD: false, // "IT'S HIM MOOOO"
        action: async (data) => {
            let translations: Array<string> = [
                "IT'S HIM", // English
                "C'EST LUI", // French
                "ES ÉL", // Spanish
                "ANDIYAN NA SIYA", // Filipino
                "01001001 01010100 00100111 01010011 00100000 01001000 01001001 01001101", // Binary
                "495427532048494D", // Hexadecimal
                "GHAH'E'", // Klingon
                "Ha'S hon" // Elvish (Sindarin)
            ];
            let rand: number = Util.Math.getRandomIntegerInclusive(0, translations.length - 1);
            let output: string = translations[rand] + " MOOOO";
            app.twitch.bot.say(output);
        }
    }, {
        trigger: "!jamm",
        aliases: ["!jammbreak", "!jam", "!jambreak"],
        userLevel: UserLevel.Broadcaster,
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter a specific break number, you dingdong.");
                return;
            }
            let effect: Effect = new JamBreak(parseInt(data.message));
            effect.setTriggerData(new ChatEventTriggerData(data));
            app.queues[effect.queueType].push(effect);
        }
    }, {
        trigger: "!leaderboard",
        action: hostURLs.cowLeaderboard,
        fetch: true
    }, {
        trigger: "!louder",
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter text next time, dingus.");
                return;
            }
            let clap: string = "👏";
            let wordArray: Array<string> = data.message.toUpperCase().split(" ");
            let newString: string = wordArray.join(" " + clap + " ");
            app.twitch.bot.say(clap + " " + newString + " " + clap);
        }
    }, {
        trigger: "!lurk",
        cooldown: 8,
        action: async () => {
            await app.obs.showSource("Bomb Lurking", "** Videos");
            await Util.sleep(5300);
            await app.obs.hideSource("Bomb Lurking", "** Videos");
        }
    }, {
        trigger: "!minion",
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter text next time, dingus.");
                return;
            }
            let url: string = "https://api.funtranslations.com/translate/minion.json";
            let body = { text: data.message };
            let json = JSON.stringify(body);
            let result: any = await Util.Web.makeRequest(url, "POST", json);
            let obj: any = JSON.parse(result.response);
            let msg: string = obj.contents.translated;
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "pantsgrab",
        userLevel: UserLevel.Broadcaster,
        permittedUsers: ["Currrrt", "RustyShakes"],
        cooldown: 60,
        action: async () => { PantsGrab.these(); }
    }, {
        trigger: "!pineapple",
        cooldown: 10,
        action: async () => { Pineapple.check(); }
    }, {
        trigger: "!pineappleallowed",
        aliases: ["!pineapplegood"],
        userLevel: UserLevel.Moderator,
        cooldown: 5,
        action: async () => { Pineapple.allowed(); }
    }, {
        trigger: "!pineappleforbidden",
        aliases: ["!pineapplebad"],
        userLevel: UserLevel.Moderator,
        cooldown: 5,
        action: async () => { Pineapple.forbidden(); }
    }, {
        trigger: "!reminder",
        cooldown: 3,
        action: async (data) => {
            let hookURL: string = webhookURLs.reminders;
            let str: string = "*Reminder from @user at @time " + 
                "on @date* \n<:MELK:616025879830855681> @message" + "";
            Util.Web.chatWebhook(str, data.extra.timestamp, data.message, data.user, hookURL);
        }
    }, {
        trigger: "!rewards",
        userLevel: UserLevel.Broadcaster,
        action: async (data) => {
            if (data.message === "pause") {
                app.twitch.rewards.pauseAll();
            } else if (data.message === "resume") {
                app.twitch.rewards.resumeAll();
            } else {
                app.twitch.bot.say("bruh wut");
            }
        }
    }, {
        trigger: "!setbutt",
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            let newWord: string = data.message;
            app.twitch.chat.say("!setword " + newWord);
        }
    }, {
        trigger: "!sfx",
        aliases: ["!soundlist"],
        action: "https://www.carefreebomb.com/sfx/"
    }, {
        trigger: "!sfxreminder",
        aliases: ["!soundreminder", "!newsound", "!addsound"],
        cooldown: 3,
        action: async (data) => {
            let hookURL: string = webhookURLs.sfx;
            let str: string = "*SFX suggestion from @user at @time " + 
                "on @date* \n<:MELK:616025879830855681> @message" + "";
            Util.Web.chatWebhook(str, data.extra.timestamp, data.message, data.user, hookURL);
        }
    }, {
        trigger: "!sounds",
        action: async (data) => {
            let url: string = hostURLs.sfxPageNumber + "?page=" + data.message;
            let result: any = await Util.Web.makeRequest(url);
            let msg: string = result.response;
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!spray",
        cooldown: 3,
        userLevel: UserLevel.VIP,
        action: async (data) => {
            Spray.bottle(<CommandEventData>data);
        }
    }, {
        trigger: "!squirrels",
        userLevel: UserLevel.Broadcaster,
        action: async () => {
            let effect: Effect = new JamBreak(2);
            let data = new EventTriggerData("CFB", "eat ass", "0");
            effect.setTriggerData(data);
            app.queues[effect.queueType].push(effect);
        }
    }, {
        trigger: "!tallgirl",
        userLevel: UserLevel.Broadcaster,
        permittedUsers: ["KonaChocolate"],
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Kona buddy, you gotta provide a username.");
                return;
            }
            app.twitch.bot.say("/timeout " + data.message + " 24 because papas fritas", true);
        }
    }, { 
        trigger: "!timeoutduration",
        aliases: ["!secondstohoursminutes", "!s2hm"],
        action: async (data) => {
            if (data.message === "" || parseInt(data.message) === NaN) {
                app.twitch.bot.say("Enter a numerical value next time, dingus.");
                return;
            }
            let duration: string = Util.Time.secToHMS(parseInt(data.message));
            app.twitch.bot.say(duration);
        }
    }, {
        trigger: "!uwu",
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter text next time, dingus.");
                return;
            }
            let url: string = "https://uwuaas.herokuapp.com/api/";
            let body = { text: data.message };
            let json = JSON.stringify(body);
            let result: any = await Util.Web.makeRequest(url, "POST", json);
            let obj: any = JSON.parse(result.response);
            let msg: string = obj.text;
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!variable",
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            let variable: string = data.message;
            let value: boolean | string = await Util.Vars.get(variable);
            app.twitch.bot.say("{ " + variable + ": " + value + " }");
        }
    }, {
        trigger: "!vfx",
        aliases: ["!videos", "!videolist"],
        action: "boned, catjam, cena, chocolate, coffin, confused, dance, dante, disappear, doit, donuts, duckhuntdog, eyboss, frydrool, frythink, game, guns, hannibal, hello, kirby, ko, manydoors, math, milk, miyamoto, nokids, notfunny, nou, nouwu, ohh, pizzatime, place, popuko, prettygood, profanity, ready, scream, scum, showme, soccer, stop, thatshot, therules, torture, totsugeki, totsugeki2, trap, tunes, wasted, wow, youdied"
    }, {
        trigger: "!yoda",
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter text next time, dingus.");
                return;
            }
            let url: string = "https://api.funtranslations.com/translate/yoda.json";
            let body = { text: data.message };
            let json = JSON.stringify(body);
            let result: any = await Util.Web.makeRequest(url, "POST", json);
            let obj: any = JSON.parse(result.response);
            let msg: string = obj.contents.translated;
            app.twitch.bot.say(msg);
        }
    },

    {
        trigger: "!playurself",
        aliases: ["!djkhaled", "!khaled", "DJ Khaled", "Khaled"],
        action: async () => {
            let khaled: Array<string> = [
                "they dont want you to have lunch",
                "the minute we think we went hard, go harder. we gotta work",
                "they wanna come stress me out? heh, bye 👋",
                "do you see that bamboo? ain't nothing like bamboo. blessup",
                "they don't want you to have a rolls royce, i promise",
                "jetski noises",
                "when you win big and you win more, they're gonna sue you. just counter sue them tho, don't back down",
                "almond milk + cinnamon toast crunch = major key to success",
                "the key is to enjoy life, because they don't want you to enjoy life",
                "they will try to close the door on you, just open it",
                "the key to more success is cocoa butter",
                "baby you smart. i want you to film me taking a shower",
                "you want my advice? don't play yourself",
                "i love having an unlimited supply of cocoa butter",
                "it's safe to say headphones is a good business",
                "the key to success is to have a hammock",
                "i got a starfruit tree, starfruit is one of my favorite fruits",
                "mostly wind noises",
                "its not an easy road, but give thanks to the road",
                "i love my bamboo trees. i love fruits. i love apples"
            ];
            let choice: number = Util.Math.getRandomIntegerInclusive(0, khaled.length - 1);
            app.twitch.bot.say(khaled[choice]);
        }
    }
];