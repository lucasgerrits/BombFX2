import { BombFX } from "../../app/BombFX.js";
import { NookVoice } from "./voices/nook/NookVoice.js";
import { SansVoice } from "./voices/sans/SansVoice.js";
import type { SubsAndDubsData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const subsAndDubsVoices: SubsAndDubsData = {
    /* "grunt": {
        duration: 90
        
    }, */
    "nook": {
        duration: 60,
        effect: new NookVoice()
    },
    "sans": {
        duration: 15,
        effect: new SansVoice()
    }
};