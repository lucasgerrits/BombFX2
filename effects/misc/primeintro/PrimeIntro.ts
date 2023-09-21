import { Barkeep } from "../../barkeep/Barkeep.js";
import { BombFX } from "../../../app/BombFX.js";
import { ChatEventTriggerData } from "../../../app/EventTriggerData.js";
import { Effect } from "../../../app/Effect.js";
import { Util } from "../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class PrimeIntro {
    
    public static async run(): Promise<void> {
        // Apply filter to hide webcam via moving position to under scene
        await app.obs.showFilter("Webcam", "Move Value - Metroid Hide");

        // Play Metroid Prime Intro sound
        await Util.sleep(1000);
        Util.playSound("effects/misc/primeintro/PrimeGameStart.mp3");

        // Turn on lightning overlay webm
        await Util.sleep(500);
        await app.obs.showSource("Cam Lightning", "** Webcam");

        // Barkeep text and tts
        await Util.sleep(6500);
        const msg: string = "Welcome back, CFB.";
        app.twitch.bot.say(msg);
        
        const effect: Effect = new Barkeep(msg);
        app.queues[effect.queueType].push(effect);

        // Hide lightning file for reset
        await Util.sleep(3000);
        await app.obs.hideSource("Cam Lightning", "** Webcam");
    }

    public static async switchSceneAndRun(): Promise<void> {
        const currentScene: string = await app.obs.getCurrentSceneName();
        
        app.obs.setScene("Just Chatting");
        
        // Scene switch events already handle BRB to chatting, this prevents double via deck button
        if (currentScene !== "Stream Starting / BRB") {
            await PrimeIntro.run();
        }
    }
}