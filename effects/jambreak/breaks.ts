import { BombFX } from '../../app/BombFX.js';
import { Util } from "../../app/util/Util.js";
import type { JamBreakData } from "../../types/EffectTypes.js";

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
            let effectScene: string = "Take On Me";

            // Play audio
            Util.playSound("./effects/jambreak/jams/aha/ahachorus.mp3");

            // Get current scene
            let currentScene: string = await app.obs.getCurrentSceneName();
            // Set current scene to source mirror properties
            if (currentScene !== effectScene) {
                await app.obs.changeMirrorSource("Take On Me Scene Mirror", currentScene);
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
    }
]