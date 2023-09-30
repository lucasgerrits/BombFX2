import { Barkeep } from "../../effects/barkeep/Barkeep.js";
import { BombFX } from "../../app/BombFX.js";
import { ChatEventTriggerData } from "../../app/EventTriggerData.js";
import { Effect } from "../../app/Effect.js";
import { EventTriggerData } from "../../app/EventTriggerData.js";
import { hostURLs, webhookURLs } from "../secrets/urls.js";
import { JamBreak } from "../../effects/jambreak/JamBreak.js";
import { LightChange } from "../../effects/lights/Lights.js";
import { PantsGrab } from "../../effects/commands/pantsgrab/PantsGrab.js";
import { Pineapple } from "../../effects/commands/pineapple/Pineapple.js";
import { Spray } from "../../effects/commands/spray/Spray.js";
import { TallGirl } from "../../effects/timeouts/tallgirl/Tallgirl.js";
import { UserLevel } from "../../app/Enums.js";
import { Util } from "../../app/util/Util.js";
import type { ChatTriggerData } from "../../types/AppTypes";
import type { CommandEventData } from "../../types/ComfyTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const actionTriggers: Array<ChatTriggerData> = [
    {
        trigger: "!cfbtest",
        userLevel: UserLevel.Broadcaster,
        action: async (data) => {
            const url: string = "https://www.wearegreenbay.com/skyviewnetwork/";
            const page: any = await Util.Requests.get(url);
            console.log(page.response);
        }
    }, {
        trigger: "!modflagtest",
        userLevel: UserLevel.Broadcaster,
        action: async (data) => {
            const response: any = await app.openAI.isModerationFlagged(data.message);
        }
    }, {
        trigger: "!barkeep",
        aliases: ["!heybarkeep", "hey barkeep"],
        userLevel: UserLevel.Moderator,
        permittedUsers: ["LimeJade", "MisterC_4", "Princess_Xena"],
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("@" + data.user + " : were you trying to ask me a question?");
                return;
            }
            const answer: any = await app.openAI.chat(data.message);
            const effect: Effect = new Barkeep(answer);
            app.queues[effect.queueType].push(effect);
            app.twitch.bot.say("@" + data.user + " : " + answer);
        }
    }, {
        trigger: "!barkeepsay",
        aliases: ["!barkeeptts"],
        userLevel: UserLevel.Broadcaster,
        permittedUsers: ["doronyaa", "KonaChocolate", "RustyShakes"],
        action: async (data) => {
            const effect: Effect = new Barkeep();
            effect.setTriggerData(new ChatEventTriggerData(data));
            app.queues[effect.queueType].push(effect);
        }
    }, {
        trigger: "!petbarkeep",
        userLevel: UserLevel.Broadcaster,
        cooldown: 30,
        action: async (data) => {
            // Make Barkeep appear
            const effect: Effect = new Barkeep("uwu am I the good boy?");
            app.queues[effect.queueType].push(effect);
            // Turn on Petting hand
            await Util.sleep(300);
            app.obs.showSource("Petting Hand", "Barkeep");
            await Util.sleep(2700);
            app.obs.hideSource("Petting Hand", "Barkeep");
        }
    }, {
        trigger: "!countdown",
        aliases: ["!racestart"],
        cooldown: 10,
        userLevel: UserLevel.VIP,
        action: async (data) => {
            // Check for empty arguments
            if (data.message === "") {
                app.twitch.bot.say("Please provide an amount of time to count down?");
                return;
            }
            // Check to make sure number passed in is actually a number and not "beans"
            if (!Util.Strings.checkNumeric(data.message)) {
                app.twitch.bot.say("I'm sorry friend, but do you know what a number is?");
                return;
            }
            // Parse argument as actual number type var
            let duration: number = parseInt(data.message);
            // Function that sends the appropriate Twitch chat message
            const announceRemainingTime = function(remainingTime: number) {
                let message: string = remainingTime + "...";
                if (remainingTime >= 30) {
                    message = Util.Numbers.secToMinSec(remainingTime) + " remaining...";
                } else if (remainingTime === 0) {
                    message = "GO!! OOOO";
                }
                app.twitch.bot.say(message);
            };
            // Function that determines whether a chat message needs to be sent yet
            const evaluateRemainingTime = function(remainingTime: number) {
                if ((remainingTime <= 10) ||
                    (remainingTime % 30 === 0)) {
                    announceRemainingTime(remainingTime);
                }
            };
            // Announce that the countdown has been created
            app.twitch.bot.say(Util.Numbers.secToMinSec(duration) + " countdown starting.");
            // The actual interval to be run that calls aforementioned functions every 1 second
            const interval = setInterval(function() {
                evaluateRemainingTime(duration);
                duration = duration - 1;
                if (duration === -1) {
                    clearInterval(interval);
                }
            }, 1000);
        }
    }, {
        trigger: "!cows",
        action: async(data) => {
            let userToCheck: string = data.user;
            if (data.message !== "") {
                userToCheck = data.message;
            }
            const url: string = hostURLs.getCowLaunchCount + "?user=" + userToCheck;
            const result: any = await Util.Requests.makeRequest(url);
            const msg: string = result.response;
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!ebnames",
        userLevel: UserLevel.Broadcaster,
        action: async () => {
            app.obs.clearText("EarthBound Name #1");
            app.obs.clearText("EarthBound Name #2");
            app.obs.clearText("EarthBound Name #3");
            app.obs.clearText("EarthBound Name #4");
        }
    }, {
        trigger: "dead rising 2",
        aliases: ["dead rlslng 2", "dead rislng 2", "dead rlsing 2"],
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
            const url: string = "https://api.2g.be/twitch/followage/carefreebomb/" + userToCheck +
                "?format=mwdhms";
            const result: any = await Util.Requests.makeRequest(url);
            const msg: string = result.response.replace("CareFreeBomb ", "") + ".";
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
            const translations: Array<string> = [
                "IT'S HIM (English)",
                "C'EST LUI (French)",
                "ES ÉL (Spanish)",
                "É ELE (Portuguese-BR)",
                "ANDIYAN NA SIYA (Filipino)",
                "KARE DA (Japanese)",
                "01001001 01010100 00100111 01010011 00100000 01001000 01001001 01001101 (Binary)",
                "495427532048494D (Hexadecimal)",
                "GHAH'E' (Klingon)",
                "Ha'S hon (Elvish-Sindarian)"
            ];
            const rand: number = Util.Numbers.getRandomIntegerInclusive(0, translations.length - 1);
            const output: string = translations[rand] + " MOOOO";
            app.twitch.bot.say(output);
        }
    }, {
        trigger: "!jamm",
        aliases: ["!jammbreak", "!jam", "!jambreak"],
        userLevel: UserLevel.Broadcaster,
        action: async (data) => {
            if (data.message === "") {
                data.message = "random";
            }
            const effect: Effect = new JamBreak(parseInt(data.message));
            effect.setTriggerData(new ChatEventTriggerData(data));
            app.queues[effect.queueType].push(effect);
        }
    }, {
        trigger: "!leaderboard",
        action: hostURLs.cowLeaderboard,
        fetch: true
    }, {
        trigger: "!lights",
        userLevel: UserLevel.Broadcaster,
        action: async (data) => {
            const effect: Effect = new LightChange();
            effect.setTriggerData(new ChatEventTriggerData(data));
            effect.start();
        }
    }, {
        trigger: "!louder",
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter text next time, dingus.");
                return;
            }
            const clap: string = "👏";
            const wordArray: Array<string> = data.message.toUpperCase().split(" ");
            const newString: string = wordArray.join(" " + clap + " ");
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
            const url: string = "https://api.funtranslations.com/translate/minion.json";
            const body = { text: data.message };
            const json = JSON.stringify(body);
            const result: any = await Util.Requests.makeRequest(url, "POST", json);
            const obj: any = JSON.parse(result.response);
            const msg: string = obj.contents.translated;
            app.twitch.bot.say(msg);
        }
    }, {
        trigger: "!mock",
        action: async (data) => {
            if (data.message === "") {
                data.message = data.user + " is a big stinky.";
            }
            const emote: string = "cfbMock";
            const mock = function(char: string) {
                return Math.random() < 0.5 ? char.toLowerCase() : char.toUpperCase();
            };
            const mockedText: string = data.message.split("").map(mock).join("");
            app.twitch.bot.say(emote + " " + mockedText);
        }
    }, {
        trigger: "!obscolor",
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter an OBS color integer to be converted.");
                return;
            } else if (!Util.Strings.checkNumeric(data.message)) {
                app.twitch.bot.say("Provided argument must be a decimal number.");
                return;
            }
        }
    }, {
        trigger: "pantsgrab",
        userLevel: UserLevel.Broadcaster,
        permittedUsers: ["Currrrt", "doronyaa", "Harlinson", "IamHadriel", "LimeJade", "LloydThePirate", "RustyShakes"],
        cooldown: 60,
        announceCD: false,
        announcePrivs: false,
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
        trigger: "!profilepic",
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            let userToView: string;
            if (data.message === "") {
                userToView = data.user;
            } else {
                userToView = data.message;
            }
            const url: string = await app.twitch.profilePic(userToView, 600);
            app.twitch.bot.say(url);
        }
    }, {
        trigger: "!reminder",
        cooldown: 3,
        action: async (data) => {
            const hookURL: string = webhookURLs.reminders;
            const str: string = "*Reminder from @user at @time " + 
                "on @date* \n<:MELK:616025879830855681> @message" + "";
            Util.Requests.chatWebhook(str, data.extra.timestamp, data.message, data.user, hookURL);
        }
    }, {
        trigger: "!remod",
        aliases: ["!fixmod", "!givemod"],
        cooldown: 10,
        announceCD: false,
        action: async (data) => {
            let targetUser: string = await app.twitch.chat.parseTagChar(data.message);
            if (targetUser === "") {
                targetUser = data.user;
            }

            if (app.twitch.isMod(targetUser)) {
                app.twitch.bot.say(targetUser + " is on the list. Remodding.");
                app.twitch.chat.modUser(targetUser);
            } else {
                app.twitch.bot.say("Specified user was not found on the moderator list.");
            }
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
            const newWord: string = data.message;
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
            const hookURL: string = webhookURLs.sfx;
            const str: string = "*SFX suggestion from @user at @time " + 
                "on @date* \n<:MELK:616025879830855681> @message" + "";
            Util.Requests.chatWebhook(str, data.extra.timestamp, data.message, data.user, hookURL);
        }
    }, {
        trigger: "!sounds",
        action: async (data) => {
            const url: string = hostURLs.sfxPageNumber + "?page=" + data.message;
            const result: any = await Util.Requests.makeRequest(url);
            const msg: string = result.response;
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
            const effect: Effect = new JamBreak(2);
            const data = new EventTriggerData("CFB", "eat ass", "0");
            effect.setTriggerData(data);
            app.queues[effect.queueType].push(effect);
        }
    }, {
        trigger: "!tallgirl",
        userLevel: UserLevel.Broadcaster,
        permittedUsers: ["KonaChocolate"],
        action: async (data) => {
            const message: string = data.message;
            if (message === "") {
                app.twitch.bot.say("Kona buddy, you gotta provide a username.");
                return;
            } else if (message.toLowerCase() === "carefreebomb") {
                app.twitch.chat.say("NOPE");
                return;
            }
            
            const effect: Effect = new TallGirl();
            const triggerData = new EventTriggerData(data.user, message, data.extra.timestamp);
            effect.setTriggerData(triggerData);
            app.queues[effect.queueType].push(effect);
        }
    }, { 
        trigger: "!timeoutduration",
        aliases: ["!secondstohoursminutes", "!s2hm"],
        action: async (data) => {
            if (data.message === "" || isNaN(parseInt(data.message))) {
                app.twitch.bot.say("Enter a numerical value next time, dingus.");
                return;
            }
            const duration: string = Util.Numbers.secToHourMinSec(parseInt(data.message));
            app.twitch.bot.say(duration);
        }
    }, {
        trigger: "!uwu",
        userLevel: UserLevel.Broadcaster,
        cooldown: 300,
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter text next time, dingus.");
                return;
            }
            const url: string = "https://uwuaas.herokuapp.com/api/";
            const body = { text: data.message };
            const json = JSON.stringify(body);
            const result: any = await Util.Requests.makeRequest(url, "POST", json);
            const obj: any = JSON.parse(result.response);
            const msg: string = obj.text;
            app.twitch.bot.say(msg);
            app.tts.say(msg, "Ivy");
        }
    }, {
        trigger: "!variable",
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            const variable: string = data.message;
            const value: boolean | string = await Util.Vars.get(variable);
            app.twitch.bot.say("{ " + variable + ": " + value + " }");
        }
    }, {
        trigger: "!vfx",
        aliases: ["!videos", "!videolist"],
        action: "boned, catjam, cena, chocolate, coffin, confused, dance, dante, disappear, dk, doit, donuts, duckhuntdog, eyboss, frydrool, frythink, game, guns, hannibal, hello, keanu, kirby, ko, manydoors, math, milk, miyamoto, nokids, notfunny, nou, nouwu, ohh, pizzatime, place, popuko, prettygood, profanity, ready, scream, scum, showme, stop, thankyou, thatshot, thepizza, therules, torture, totsugeki, totsugeki2, trap, tunes, wasted, wow, youdied"
    }, {
        trigger: "!yoda",
        action: async (data) => {
            if (data.message === "") {
                app.twitch.bot.say("Enter text next time, dingus.");
                return;
            }
            const url: string = "https://api.funtranslations.com/translate/yoda.json";
            const body = { text: data.message };
            const json = JSON.stringify(body);
            const result: any = await Util.Requests.makeRequest(url, "POST", json);
            const obj: any = JSON.parse(result.response);
            const msg: string = obj.contents.translated;
            app.twitch.bot.say(msg);
        }
    },

    {
        trigger: "!playurself",
        aliases: ["!djkhaled", "!khaled", "DJ Khaled", "Khaled"],
        action: async () => {
            const khaled: Array<string> = [
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
            const choice: number = Util.Numbers.getRandomIntegerInclusive(0, khaled.length - 1);
            app.twitch.bot.say(khaled[choice]);
        }
    }
];