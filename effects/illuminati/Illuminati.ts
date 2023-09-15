import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class Illuminati extends Effect {
    constructor() {
        super(EffectQueueName.Camera);
    }
    
    public override async start(): Promise<void> {
        const triangleMediaSource: string = "Illuminati Triangle";
        const webcamScene: string = "** Webcam";
        const webcamSource: string = "Webcam";

        await this.setRandomTransforms();

        Util.playSound("effects/illuminati/audio/xfile.mp3");

        // Enable cam filters
        await app.obs.showFilter(webcamSource, "Color Correction - Grayscale");
        await app.obs.showFilter(webcamSource, "Freeze");
        await app.obs.showFilter(webcamSource, "Move Value - Illuminati Camera Transform");

        await Util.sleep(200);

        // Show webm
        await app.obs.showSource(triangleMediaSource, webcamScene);

        await Util.sleep(4000);

        // Hide webm
        await app.obs.hideSource(triangleMediaSource, webcamScene);

        // Disable cam filters
        app.obs.showFilter(webcamSource, "Move Value - Reset Transform");
        app.obs.hideFilter(webcamSource, "Color Correction - Grayscale");
        app.obs.hideFilter(webcamSource, "Freeze");
    }

    /**
     * Determines the random scale and 
     */
    private async setRandomTransforms(): Promise<void> {
        const posRange: number = 200; // Previously 500
        const rotRange: number = 70; // Hard max 180
        const scaleRange: number = 300;

        // pos_x, y, z, rot_x, y, z, scale_x, 
        await app.obs.setSourceFilterSettings("Webcam", "Move Value - Illuminati Camera Transform", {
            "pos_x": Util.Numbers.getRandomIntegerInclusive(-posRange, posRange),
            "pos_y": Util.Numbers.getRandomIntegerInclusive(-posRange, posRange),
            "pos_z": Util.Numbers.getRandomIntegerInclusive(-posRange, posRange),
            "rot_x": Util.Numbers.getRandomIntegerInclusive(-rotRange, rotRange),
            "rot_y": Util.Numbers.getRandomIntegerInclusive(-rotRange, rotRange),
            "rot_z": Util.Numbers.getRandomIntegerInclusive(-rotRange, rotRange),
            "scale_x": Util.Numbers.getRandomIntegerInclusive(0, scaleRange),
            "scale_y": Util.Numbers.getRandomIntegerInclusive(0, scaleRange)
        });
    }
}