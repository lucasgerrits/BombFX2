import { BombFX } from "../app/BombFX.js";
import { Util } from "../app/util/Util.js";
import type { SceneTransition, TransitionScenes } from "../types/AppTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const transitionsList: Array<SceneTransition> = [
    {
        scene: "Just Chatting",
        to: async (data: TransitionScenes) => {
            if (data.fromScene === "Stream Starting / BRB") {
                await app.obs.showFilter("Webcam", "Metroid Move Value Hide");
                await Util.sleep(1000);
                Util.playSound("effects/stuff/PrimeGameStart.mp3");
                await Util.sleep(500);
                await app.obs.showSource("Cam Lightning", "** Webcam");
                await Util.sleep(6500);
                const msg = "Welcome back, CFB.";
                app.twitch.bot.say(msg);
                app.tts.say(msg);
                await Util.sleep(3000);
                await app.obs.hideSource("Cam Lightning", "** Webcam");
            }
        },
        from: async (data) => {
            Util.sleep(1);
        }
    }, {
        scene: "Stream Starting / BRB",
        to: async (data) => {
            app.obs.muteMic();
            
            app.twitch.rewards.pauseAll();
            
            //commands.cat.pause();
        },
        from: async (data) => {
            app.obs.unmuteMic();

            // Unmute Alerts overlay
            app.obs.setInputMute("StreamElements", false);

            if (data.toScene === "Just Chatting") {
                await Util.sleepInSeconds(90);
                app.twitch.rewards.resumeAll();
            } else {
                //await Util.sleepInSeconds(5);
            }
            
            //commands.cat.resume();
        }
    }
];