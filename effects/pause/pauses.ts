import { BombFX } from "../../app/BombFX.js";
import { Pause } from "./Pause.js";
import { Util } from "../../app/util/Util.js";
import type { PauseTypeData, PauseEventData } from "../../types/EffectTypes.js";


// eslint-disable-next-line no-var
declare var app: BombFX;

export const pauses: Record<string, PauseTypeData> = {
    "hl2": {
        game: "Half-Life 2",
        duration: 6000,
        action: "HL2 Load"
    },
    "melee": {
        game: "Super Smash Bros. Melee (GameCube)",
        action: async (data: PauseEventData) => {
            async function pauseOn(text?: string) {
                //console.log(text);
                await app.obs.showSource("Smash Melee Pause Sound", Pause.scene);
                console.log("sound started");
                await app.obs.showSource("Smash Melee Pause Screen", Pause.scene);
                console.log("image showing");
                await Util.sleep(100);
                await app.obs.showFilter(data.scene, data.filter);
                await app.obs.hideSource("Smash Melee Pause Sound", Pause.scene);
                await app.obs.muteMic();
                await app.obs.muteDesktop();
            }

            async function pauseOff(text?: string) {
                //console.log(text);
                await app.obs.hideFilter(data.scene, data.filter);
                await app.obs.hideSource("Smash Melee Pause Screen", Pause.scene);
                await app.obs.unmuteMic();
                await app.obs.unmuteDesktop();
            }

            await pauseOn("on 1");
            await Util.sleep(500);
            await pauseOff("off 1");
            await Util.sleep(300);

            await pauseOn("on 2");
            await Util.sleep(500);
            await pauseOff("off 2");
            await Util.sleep(300);

            await pauseOn("on 3");
            await Util.sleep(3000);
            await pauseOff("off 3");
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
    }
};