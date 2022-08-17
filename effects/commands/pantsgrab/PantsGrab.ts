import { BombFX } from '../../../app/BombFX.js';
import { Logger } from '../../../app/Logger.js';
import { Util } from '../../../app/Util.js';

declare var app: BombFX;

export class PantsGrab {

    public static cooldownInSec: number = 300;
    public static cooldownInMS: number = PantsGrab.cooldownInSec * 1000;
    public static isOnCooldown: boolean = false;

    public static async these(user: string = "voice") {
        if (user !== "voice" && PantsGrab.isOnCooldown) {
            let errorMsg: string = "No pants were grabbed due to cooldown.";
            Logger.noise(errorMsg);
            app.twitch.bot.say(errorMsg);
            return;
        }

        Util.playSoundForDuration("effects/commands/pantsgrab/OHHHH.mp3", 2000);

        await app.obs.showSource("PantsGrab", "** Mega Overlay");

        await Util.sleep(2000);

        await app.obs.hideSource("PantsGrab", "** Mega Overlay");

        if (user !== "voice") {
            PantsGrab.isOnCooldown = true;

            setTimeout(() => {
                PantsGrab.isOnCooldown = false;
            }, PantsGrab.cooldownInMS);
        }
    }
}