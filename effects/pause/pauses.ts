import { BombFX } from "../../app/BombFX.js";
import { Pause } from "./Pause.js";
import { Util } from "../../app/util/Util.js";
import type { PauseTypeData, PauseEventData } from "../../types/EffectTypes.js";


// eslint-disable-next-line no-var
declare var app: BombFX;

export const pauses: Record<string, PauseTypeData> = {
    "athf": {
        duration: 5100,
        action: "ATHF Credits"
    },
    "banjo": {
        game: "Banjo-Kazooie",
        duration: 8000,
        action: "Banjo Kazooie Pause Screen"
    },
    "bebop": {
        duration: 7600,
        action: "Bebop Pause"
    },
    "hl2": {
        game: "Half-Life 2",
        duration: 6000,
        action: "HL2 Load"
    },
    "melee": {
        game: "Super Smash Bros. Melee (GameCube)",
        action: async (data: PauseEventData) => {
            Util.sleep(1);
        }
    },
    "sf2": {
        game: "Street Fighter II: The World Warrior (SNES)",
        duration: 6100,
        action: "Street Fighter II Pause Sounds"
    },
    "toads": {
        game: "Battletoads (NES)",
        duration: 8100,
        action: "Battletoads Pause Jam"
    },
    "trigun": {
        duration: 11600,
        action: "Trigun Pause"
    },
    "waitwhat": {
        duration: 8000,
        action: "Encoder Error"
    }
};