import { BombFX } from "../../../app/BombFX.js";
import { Util } from "../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class Pineapple {

    public static async check() {
        const allowed: boolean | string = await Util.Vars.get("pineapple");

        let source: string = "Pineapple Yes";
        let msg: string = "Pineapple currently ALLOWED - This specific stream is backseat and spoiler friendly.";
        
        if (!allowed) {
            source = "Pineapple No";
            msg = "Pineapple currently FORBIDDEN - This specific stream is NOT backseat and spoiler friendly.";
        }

        app.twitch.bot.say(msg);

        await app.obs.showSource(source, "** Webcam");
        await Util.sleep(4000);
        await app.obs.hideSource(source, "** Webcam");
    }

    public static async allowed() {
        Pineapple.set(true);
    }

    public static async forbidden() {
        Pineapple.set(false);
    }

    private static async set(allowed: boolean = true) {
        const result: any = await Util.Vars.set("pineapple", allowed.toString());
        let outputStr: string = "";
        if (result.response === "success") {
            outputStr = "Successfully set pineapple mode to ";
            if (allowed) {
                outputStr += "ALLOWED";
            } else {
                outputStr += "FORBIDDEN";
            }
            app.twitch.bot.say(outputStr);
        } else {
            app.twitch.bot.say("Something went wrong with setting the pineapple mode...");
        }
    }
}