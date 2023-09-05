import { BombFX } from "../../../../app/BombFX.js";
import { Util } from "../../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const aha = async () => {
    // Credit to KonaChocolate for scribble overlay
    const effectScene: string = "Take On Me";

    // Play audio
    Util.playSound("./effects/jambreak/jams/aha/ahachorus.mp3");

    // Get current scene
    const currentScene: string = await app.obs.getCurrentSceneName();
    // Set current scene to source clone properties
    if (currentScene !== effectScene) {
        await app.obs.setCloneSource("Take On Me Scene Clone", currentScene);
        // Switch to Take On Me scene
        await app.obs.setScene(effectScene);
    }

    // Chat spam
    await Util.sleep(16000);
    app.twitch.bot.say("IN A DAY OR -");
    await Util.sleep(1000);
    app.twitch.bot.say("TWOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO");
    await Util.sleep(5000);

    // Revert to original scene
    if (currentScene !== effectScene) {
        await app.obs.setScene(currentScene);
    }
};