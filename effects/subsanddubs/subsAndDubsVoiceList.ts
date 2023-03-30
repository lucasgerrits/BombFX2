import { BombFX } from "../../app/BombFX.js";
import type { SubsAndDubsData } from "../../types/EffectTypes.js";
import { NookVoice } from "./voices/nook/NookVoice.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const subsAndDubsVoices: SubsAndDubsData = {
    /* "grunt": {
        duration: 90
        
    }, */
    "nook": {
        duration: 60,
        effect: new NookVoice()
    }
};