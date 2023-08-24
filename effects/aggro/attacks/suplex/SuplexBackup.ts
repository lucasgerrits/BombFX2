
import { BombFX } from "../../../../app/BombFX.js";
import { Effect } from "../../../../app/Effect.js";
import { EffectQueueName } from "../../../../app/EffectQueue.js";
import { Reward } from "../../../../app/twitch/Reward.js";
import { Util } from "../../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class SuplexReward extends Reward {
    public static override id: string = "f26124c1-3683-4d2d-bc73-24c32e0bf2f0";
    public static override title: string = "Suplex";
    public static override cost: number = 200;

    constructor() {
        super(SuplexReward.id, SuplexReward.title, new Suplex());
        this.allowedOnBRB = true;
    }
}

export class Suplex extends Effect {
    constructor() {
        super(EffectQueueName.Scene);
    }
    
    public override async start(): Promise<void> {
        // Get current scene
        const currentScene: string = await app.obs.getCurrentSceneName();

        // Set current scene to source mirror properties
        if (currentScene !== "Suplex") {
            await app.obs.setCloneSource("Suplex Current Scene Mirror", currentScene);

            // Switch to suplex scene
            await app.obs.setScene("Suplex");
        }
        await Util.sleep(500);

        // Play suplex video
        await app.obs.showSource("Suplex Dot Webm", "Suplex");
        await Util.sleep(6500);

        // Apply filter to move source mirror up
        await app.obs.showFilter("Suplex", "Suplex - Up");
        await Util.sleep(300);

        // Apply filter to vertical flip current scene
        await app.obs.showFilter("Suplex Current Scene Mirror", "Vertical Flip");
        await Util.sleep(1250);

        // Undo flip fliter to return scene to proper vertical orientation
        await app.obs.hideFilter("Suplex Current Scene Mirror", "Vertical Flip");
        await Util.sleep(2000);

        // Revert to original scene
        if (currentScene !== "Suplex") {
            await app.obs.setScene(currentScene);
        }
        
        // Turn off video
        await app.obs.hideSource("Suplex Dot Webm", "Suplex");
    }
}