import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class TheWordReward extends Reward {
    public static override id: string = "dd5ca1f3-c846-442a-b4a0-519ad21166ad";
    public static override title: string = "Forbidden Word";
    public static override cost: number = 700;
    
    constructor() {
        super(TheWordReward.id, TheWordReward.title, new TheWord());
    }
}

export class TheWord extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        // message, rawInputEscaped
        app.sbot.doAction("Rewards - Forbidden Word", { "rawInput": this.triggerData.message });
    }
}