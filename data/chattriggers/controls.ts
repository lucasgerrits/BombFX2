import { BombFX } from "../../app/BombFX.js";
import { UserLevel } from "../../app/Enums.js";
import { Util } from "../../app/util/Util.js";
import type { ChatTriggerData } from "../../types/AppTypes";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const controlTriggers: Array<ChatTriggerData> = [
    {
        trigger: "!bedzoom",
        aliases: ["!bedgezoom"],
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            const direction: string = data.message.toLowerCase();
            if (direction === "") {
                app.twitch.bot.say("Please specify a direction.");
                return;
            } else if (direction === "in") {
                app.obs.showFilter("DroidCam Boot's Phone", "Move Value Zoom In");
            } else if (direction === "out") {
                app.obs.showFilter("DroidCam Boot's Phone", "Move Value Zoom Out");
            } else {
                app.twitch.bot.say("Don't");
            }
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
        trigger: "!refresh",
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            let source: string = "nothing";
            if (data.message === "") {
                app.twitch.bot.say("You need to include an argument: all, chat, code, streamelements, weather");
                return;
            } else if (data.message === "code") {
                app.obs.refreshBrowserSource("Bomb FX 2");
                source = "CFB's code";
            } else if (data.message === "chat") {
                app.obs.refreshBrowserSource("Sideways Chat");
                source = "Sideways Chat";
            } else if (data.message === "streamelements" || data.message === "alerts" || data.message === "se") {
                app.obs.refreshBrowserSource("StreamElements");
                source = "StreamElements overlay";
            } else if (data.message === "weather") {
                app.obs.refreshBrowserSource("Google Weather Result");
                source = "weather results";
            } else if (data.message === "all") {
                app.obs.refreshBrowserSource("Bomb FX 2");
                app.obs.refreshBrowserSource("Sideways Chat");
                app.obs.refreshBrowserSource("StreamElements");
                source = "E V E R Y T H I N G";
            }
            app.twitch.bot.say("Refreshing " + source + ".");
        }
    }, {
        trigger: "!scene",
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            const sceneIn: string = data.message.toLowerCase();
            let sceneName: string = "";
            if (sceneIn === "") {
                app.twitch.bot.say("You need to include an argument: bed, brb, chatting, desktop (main), phone (irl, car), retro, street (weather)");
                return;
            } else if (sceneIn === "bed" || sceneIn === "bedge") {
                sceneName = "Bed Time";
            } else if (sceneIn === "brb") {
                sceneName = "Stream Starting / BRB";
            } else if (sceneIn === "chatting" || sceneIn === "chat") {
                sceneName = "Just Chatting";
            } else if (sceneIn === "code" || sceneIn === "coding") {
                sceneName = "Coding";
            } else if (sceneIn === "desktop" || sceneIn === "main") {
                sceneName = "Desktop + Cam - Bottom";
            } else if (sceneIn === "phone" || sceneIn === "irl" || sceneIn === "car") {
                sceneName = "Phone Stuff";
            } else if (sceneIn === "retro" || sceneIn === "original hardware") {
                sceneName = "Retro";
            } else if (sceneIn === "street" || sceneIn === "appleton" || sceneIn ==="weather") {
                sceneName = "Appleton Cam Full";
            }
            app.twitch.bot.say("Switching to scene: " + sceneName);
            app.obs.setScene(sceneName);
        }
    }, {
        trigger: "!stream",
        userLevel: UserLevel.Moderator,
        action: async (data) => {
            if (data.message === "start") {
                app.twitch.bot.say("Attempting to start stream output. If the 48 hour " +
                    "mark was hit, please use stop first or just restart instead.");
                app.obs.startStream();
            } else if (data.message === "stop") {
                app.twitch.bot.say("Attempting to stop stream output.");
                app.obs.stopStream();
            } else if (data.message === "restart") {
                app.twitch.bot.say("Attempting to restart stream output. Now stopping, " + 
                    "will start in 15 seconds.");
                app.obs.stopStream();
                await Util.sleep(10000);
                app.twitch.bot.say("Now starting.");
                app.obs.startStream();
            } else {
                app.twitch.bot.say("You need to include an argument: start, stop, restart");
            }
        }
    }
];