import { BombFX } from "../../app/BombFX.js";
import { Util } from "../../app/util/Util.js";

declare var app: BombFX;

export class Kona {
    private static debug: boolean = false;
    
    private static sounds: Array<string> = [
        "Bobbius",
        "CFBB",
        "Dorororo1",
        "Dorororo2",
        "Eazy",
        "HarlHarlHarl",
        "OG",
        "Walpo",
        "Wustyo"
    ];

    public static async wave(): Promise<void> {
        await app.obs.showSource("Kona Wave", "** Videos");

        let choice: number = Util.Numbers.getRandomIntegerInclusive(0, Kona.sounds.length - 1);
        let filename: string = "./effects/kona/sounds/" + Kona.sounds[choice] + ".mp3";
        Util.playSound(filename);

        await Util.sleep(2000);
        app.twitch.bot.say("Kona");

        await Util.sleep(5000);
        await app.obs.hideSource("Kona Wave", "** Videos");
    }

    public static determineInterval(): number {
        const debugms: number = Util.Numbers.secToMS(20);
        
        const min: number = Util.Numbers.minToMS(30);
        const max: number = Util.Numbers.minToMS(60);

        if (Kona.debug) {
            return debugms;
        } else {
            const ms: number = Util.Numbers.getRandomIntegerInclusive(min, max);
            return ms;
        }
    }
}