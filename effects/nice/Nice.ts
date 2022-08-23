import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class NiceReward extends Reward {
    public static override id: string = "abc451cf-0c3c-4ec2-9fb2-794f8dcae415";
    public static override title: string = "Nice!";
    public static override cost: number = 69;

    constructor() {
        super(NiceReward.id, NiceReward.title, new Nice());
        this.allowedOnBRB = true;
    }
}

export class Nice extends Effect {
    constructor() {
        super(EffectQueueName.Media);
    }
    
    public override async start(): Promise<void> {
        await app.obs.showSource("Cool Dot Webm", "** Videos");
        await Util.sleep(5100);
        await app.obs.hideSource("Cool Dot Webm", "** Videos");
    }
}