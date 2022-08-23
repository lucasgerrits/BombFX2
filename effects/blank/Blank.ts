import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

export class BlankReward extends Reward {
    public static override id: string = "";
    public static override title: string = "";
    public static override cost: number = 100;

    constructor() {
        super(BlankReward.id, BlankReward.title, new Blank());
    }
}

export class Blank extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        Util.sleep(1);
    }
}