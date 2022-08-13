import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/Util.js';

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
        let scootAmount: number = 60;
        let scootTime: number = 900;
        let x: number = 1181.0;
        let endX: number = -1174.0;

        // Reset King Zora's position in case of improper end
        await app.obs.showFilter("** Videos", "Zora - Reset");

        // Show video
        await app.obs.showSource("King Zora", "** Videos");
        
        // While King Zora has not yet reached left edge, scoot left
        while (x > endX) {
            x -= scootAmount;
            await this.moveKingZora(x, scootTime);
        }

        // Hide video
        await app.obs.hideSource("King Zora", "** Videos");

        // Reset King Zora's position again
        await app.obs.showFilter("** Videos", "Zora - Reset");
    }
    
    private async moveKingZora(newX: number, duration: number) {
        // Adjust Move Source filter settings
        let transform_text: string = "pos: x " + newX + 
            ".0 y 378.0 rot: 0.0 scale: x 1.000 y 1.000 crop: l 0 t 0 r 0 b 0";
        await app.obs.send('SetSourceFilterSettings', {
            "sourceName" : "** Videos",
            "filterName" : "Zora - Move",
            "filterSettings" : {
                "duration" : duration,
                "pos" : {
                    "x" : newX,
                    "x_sign" : " ",
                    "y" : 378,
                    "y_sign" : " "
                },
                "transform_text" : transform_text
            }
        });
        await Util.sleep(300);

        // Apply the filter and replay video
        await app.obs.showFilter("** Videos", "Zora - Move");
        await app.obs.restartMedia("King Zora");
        await app.obs.playMedia("King Zora");
        await Util.sleep(200);

        this.scootSound();
        await Util.sleep(duration + 200);
    }

    private scootSound(): void {
        let num: number = Util.Math.getRandomIntegerInclusive(1, 3);
        let filename = "effects/zora/scoot" + num + ".mp3";
        Util.playSound(filename);
    }
}