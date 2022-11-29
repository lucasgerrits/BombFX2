import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class LightsReward extends Reward {
    public static override id: string = "93d36d13-453d-4202-ac8a-6211982aa802";
    public static override title: string = "Change BG Lights";
    public static override cost: number = 100;

    constructor() {
        super(LightsReward.id, LightsReward.title, new LightChange());
    }
}

export class LightChange extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        // Get color string from user's Twitch redemption text input
        const colorStr: string = this.triggerData.message;

        // Convert said string to any possible corresponding hex value
        let hexVal: string = Util.Colors.convertStringToHex(colorStr);

        // Determine if color string could be processed properly, or if input value is black
        if (hexVal === "#000000") {
            app.twitch.bot.say("Input value could not be used. Assigning random color.");
            hexVal = Util.Colors.createRandomHex();
            console.log(hexVal);
        }
        
        // Send hex value to appropriate bulb(s)
        app.lumia.sendHex(hexVal);
    }
}