import { BombFX } from "../../app/BombFX.js";
import { Util } from "../../app/util/Util.js";
import type { JamBreakData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const jambreaks: Array<JamBreakData> = [
    {
        name: "\"Conga\" - Gloria Estefan, Miami Sound Machine",
        action: "Ditto Conga",
        duration: 21000,
        chatText: "(ditto) dittoDumper come on (ditto) dittoDumper " + 
        "shake ya body baby (ditto) dittoDumper do the conga (ditto) dittoDumper " +
        "I know (ditto) dittoDumper you can't control yourself (ditto) dittoDumper " +
        "any longer (ditto) dittoDumper pugPls"
    },
    {
        name: "\"Butterfly\" - Smile.dk",
        action: "Butterfly Dot Webm",
        duration: 26000,
        chatText: "🦋 B Y E 🦋 C H A I R 🦋"
    },
    {
        name: "\"Я буду Ебать\" - Moreart, IHI",
        action: "Squirrels Dot Webm",
        duration: 21000,
        chatText: "squirrelJAM squirrelJam squirrelJAM squirrelJam squirrelJAM squirrelJam squirrelJAM squirrelJam "
    },
    {
        name: "\"Caramelldansen\" - Caramella Girls",
        action: "Caramelldansen",
        duration: 24000,
        chatText: "O-o, o-a, o-a! O-o, o-a, o-a~a-a~ O-o, o-a, o-a! O-o, o-a, o-a~a-a~"
    },
    {
        name: "\"Take On Me\" - a-ha",
        action: async () => {
            // Credit to KonaChocolate for scribble overlay
            // Credit to Nutty for effect filter settings + testing
            const effectScene: string = "Take On Me";

            // Play audio
            Util.playSound("./effects/jambreak/jams/aha/ahachorus.mp3");

            // Get current scene
            const currentScene: string = await app.obs.getCurrentSceneName();
            // Set current scene to source mirror properties
            if (currentScene !== effectScene) {
                await app.obs.changeMirrorSource("Take On Me Scene Clone", currentScene);
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
        }
    },
    {
        name: "\"The Red\" - Chevelle",
        chatText: "pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN",
        action: async() => {
            const effectScene: string = "Seeing Red";
            const sceneCloneLeft: string = "Seeing Red - Left Scene Clone";
            const sceneCloneRight: string = "Seeing Red - Right Scene Clone";

            // Get current scene
            const currentScene: string = await app.obs.getCurrentSceneName();

            // Set current scene to both source mirror properties
            if (currentScene !== effectScene) {
                await app.obs.changeMirrorSource(sceneCloneLeft, currentScene);
                await app.obs.changeMirrorSource(sceneCloneRight, currentScene);
                // Switch to effect scene
                await app.obs.setScene(effectScene);
            }

            await Util.sleep(1000);

            // Move goggles into position
            await app.obs.showFilter(effectScene, "Move Goggles Center");

            await Util.sleep(1500);

            // Play audio
            Util.playSound("./effects/jambreak/jams/red/TheRed.mp3");
            
            // Fade in eye screens
            app.obs.showSource(sceneCloneLeft, effectScene);
            app.obs.showSource(sceneCloneRight, effectScene);

            await Util.sleep(500);

            // Start regular speed zoom blur filters
            app.obs.showFilter(sceneCloneLeft, "Zoom Blur");
            app.obs.showFilter(sceneCloneRight, "Zoom Blur");

            // Start goggle wiggle filter
            await app.obs.showFilter(effectScene, "Move Goggles Left");

            await Util.sleep(19000);

            // Start faster speed zoom blur filters
            app.obs.showFilter(sceneCloneLeft, "Zoom Blur Faster");
            app.obs.showFilter(sceneCloneRight, "Zoom Blur Faster");

            // Stop regular speed zoom blur filters
            app.obs.hideFilter(sceneCloneLeft, "Zoom Blur");
            app.obs.hideFilter(sceneCloneRight, "Zoom Blur");

            await Util.sleep(6000);

            // Fade out eye screens
            app.obs.hideSource(sceneCloneLeft, effectScene);
            app.obs.hideSource(sceneCloneRight, effectScene);

            // Turn off wiggle filters
            app.obs.hideFilter(effectScene, "Move Goggles Left");
            app.obs.hideFilter(effectScene, "Move Goggles Right");

            await Util.sleep(500);

            // Move goggles back out of view
            app.obs.showFilter(effectScene, "Move Goggles Bottom");

            await Util.sleep(1900);
            await app.obs.setScene(currentScene);

            // Stop faster speed zoom blur filters
            app.obs.hideFilter(sceneCloneLeft, "Zoom Blur Faster");
            app.obs.hideFilter(sceneCloneRight, "Zoom Blur Faster");
        }
    }
];