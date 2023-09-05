import { BombFX } from "../../app/BombFX.js";
import { Util } from "../../app/util/Util.js";
import type { JamBreakData } from "../../types/EffectTypes.js";

// Break-specific imports
import { aha } from "./jams/aha/TakeOnMe.js";
import { red } from "./jams/red/TheRed.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const jamBreaks: Record<string, JamBreakData> = {
    "ditto": {
        name: "\"Conga\" - Gloria Estefan, Miami Sound Machine",
        action: "Ditto Conga",
        duration: 21000,
        chatText: "(ditto) dittoDumper come on (ditto) dittoDumper " + 
        "shake ya body baby (ditto) dittoDumper do the conga (ditto) dittoDumper " +
        "I know (ditto) dittoDumper you can't control yourself (ditto) dittoDumper " +
        "any longer (ditto) dittoDumper pugPls"
    },
    "butterfly": {
        name: "\"Butterfly\" - Smile.dk",
        action: "Butterfly Dot Webm",
        duration: 26000,
        chatText: "🦋 B Y E 🦋 C H A I R 🦋"
    },
    "squirrel": {
        name: "\"Я буду Ебать\" - Moreart, IHI",
        action: "Squirrels Dot Webm",
        duration: 21000,
        chatText: "squirrelJAM squirrelJam squirrelJAM squirrelJam squirrelJAM squirrelJam squirrelJAM squirrelJam"
    },
    "dansen": {
        name: "\"Caramelldansen\" - Caramella Girls",
        action: "Caramelldansen",
        duration: 24000,
        chatText: "O-o, o-a, o-a! O-o, o-a, o-a~a-a~ O-o, o-a, o-a! O-o, o-a, o-a~a-a~"
    },
    "aha": {
        name: "\"Take On Me\" - a-ha",
        action: aha
    },
    "red": {
        name: "\"The Red\" - Chevelle",
        chatText: "pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN pokiBASS SEEING RED AGAIN",
        action: red
    }
};