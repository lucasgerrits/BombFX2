import { BombFX } from "../app/BombFX.js";
import { PrimeIntro } from "../effects/misc/primeintro/PrimeIntro.js";
import { Util } from "../app/util/Util.js";
import type { SceneTransition, TransitionScenes } from "../types/AppTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const transitionsList: Array<SceneTransition> = [
    {
        scene: "Just Chatting",
        to: async (data: TransitionScenes) => {
            if (data.fromScene === "Stream Starting / BRB") {
                PrimeIntro.run();
            }
        },
        from: async (data) => {
            Util.sleep(1);
        }
    }, {
        scene: "Stream Starting / BRB",
        to: async (data) => {
            app.obs.muteMic();
            
            //app.twitch.rewards.pauseAll();
            
            //commands.cat.pause();
        },
        from: async (data) => {
            app.obs.unmuteMic();

            // Unmute Alerts overlay
            app.obs.setInputMute("StreamElements", false);

            /*
            if (data.toScene === "Just Chatting") {
                await Util.sleepInSeconds(90);
                app.twitch.rewards.resumeAll();
            } else {
                //await Util.sleepInSeconds(5);
            }
            */

            // hi chat
            
            //commands.cat.resume();
        }
    }
];