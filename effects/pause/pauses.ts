import { BombFX } from "../../app/BombFX.js";
import type { PauseData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const pauses: Array<PauseData> = [
    {
        game: "Battletoads (NES)",
        duration: 8100,
        action: "Battletoads Pause Jam"
    }, {
        game: "Street Fighter II: The World Warrior (SNES)",
        duration: 6100,
        action: "Street Fighter II Pause Sounds"
    }
];