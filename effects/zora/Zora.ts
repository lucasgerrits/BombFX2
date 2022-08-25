import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class ZoraReward extends Reward {
    public static override id: string = "7ca5b9c5-2ecb-458f-b074-e3bff11b61ee";
    public static override title: string = "MWEEP";
    public static override cost: number = 2000;

    constructor() {
        super(ZoraReward.id, ZoraReward.title, new Zora());
        this.allowedOnBRB = true;
    }
}

export class Zora extends Effect {
    constructor() {
        super(EffectQueueName.Zora);
    }
    
    public override async start(): Promise<void> {
        const scootAmount: number = 60;
        const scootTime: number = 900;
        const startX: number = 1181.0;
        const endX: number = -1174.0;
        let x: number = startX;

        // Reset King Zora's position in case of improper end
        await app.obs.showFilter("** Videos", "Zora - Reset");

        // Show video
        await app.obs.showSource("King Zora", "** Videos");
        
        // While King Zora has not yet reached left edge, scoot left
        while (x > endX) {
            if (x < startX) {
                await this.pleaseHold();
            }
            x -= scootAmount;
            await this.moveKingZora(x, scootTime);
        }

        // Hide video
        await app.obs.hideSource("King Zora", "** Videos");

        // Reset King Zora's position again
        await app.obs.showFilter("** Videos", "Zora - Reset");
    }
    
    private async pleaseHold(): Promise<void> {
        const chance: number = 5;
        const waitMinInSec: number = 3;
        const waitMaxInSec: number = 15;

        // There is a chance to make him wait
        const roll: number = Util.Numbers.getRandomIntegerInclusive(1, 100);
        if (roll <= chance) {
            // Random wait time
            const waitInSec: number = Util.Numbers.getRandomIntegerInclusive(waitMinInSec, waitMaxInSec);
            const waitInMS: number = waitInSec * 1000;
            Logger.noise("Waiting " + waitInSec + " seconds for scoots.");
            app.twitch.bot.say("PauseFish", true);
            await Util.sleep(waitInMS);
            app.twitch.bot.say("OOOO", true);
        }
    }

    private async moveKingZora(newX: number, duration: number): Promise<void> {
        // Adjust Move Source filter settings
        const transform_text: string = "pos: x " + newX + 
            ".0 y 378.0 rot: 0.0 scale: x 1.000 y 1.000 crop: l 0 t 0 r 0 b 0";
        //Logger.noise("Sending filter settings");
        await app.obs.setSourceFilterSettings("** Videos", "Zora - Move", {
            "duration" : duration,
            "pos" : {
                "x" : newX,
                "x_sign" : " ",
                "y" : 378,
                "y_sign" : " "
            },
            "transform_text" : transform_text
        });
        //Logger.noise("Sent filter settings");
        await Util.sleep(100);

        // Apply the filter and replay video
        
        //Logger.noise("Playing media");
        app.obs.playMedia("King Zora");

        await Util.sleep(350);

        //Logger.bomb("Restarting media");
        app.obs.restartMedia("King Zora");

        await Util.sleep(550);
        
        //Logger.bomb("Starting move filter");
        app.obs.showFilter("** Videos", "Zora - Move");
        
        this.scootSound();
        await Util.sleep(duration + 25);
    }

    private async scootSound(): Promise<void> {
        await Util.sleep(650);
        const num: number = Util.Numbers.getRandomIntegerInclusive(1, 3);
        const filename = "effects/zora/audio/scoot" + num + ".mp3";
        Util.playSound(filename);
    }
}