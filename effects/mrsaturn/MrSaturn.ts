import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class MrSaturnReward extends Reward {
    public static override id: string = "";
    public static override title: string = "Boing Zoom";
    public static override cost: number = 50;

    constructor() {
        super(MrSaturnReward.id, MrSaturnReward.title, new MrSaturn(), MrSaturnReward.buttonColor);
    }
}

export class MrSaturn extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        
    }
}