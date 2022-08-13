import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/Util.js';

declare var app: BombFX;

export class SpacebarReward extends Reward {
    public static override id: string = "6e267949-44cb-47fb-9270-3478c74a289b";
    public static override title: string = "Spacebar";
    public static override cost: number = 25;
    
    constructor() {
        super(SpacebarReward.id, SpacebarReward.title, new Spacebar());
    }
}

export class Spacebar extends Effect {
    constructor() {
        super(EffectQueueName.Jump);
    }
    
    public override async start(): Promise<void> {
        Util.playSound("effects/spacebar/QuakeJumpSound.mp3");

        app.obs.showFilter("Webcam", "Quake Move Value Rise");

        await Util.sleep(1000);
    }
}