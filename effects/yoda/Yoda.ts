import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Logger } from '../../app/Logger.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/Util.js';

declare var app: BombFX;

export class YodaReward extends Reward {
    public static override id: string = "a5a12697-258e-4d3b-addb-0d1fbac88b16";
    public static override title: string = "Yoda TTS";
    public static override cost: number = 1200;
    
    constructor() {
        super(YodaReward.id, YodaReward.title, new Yoda());
    }
}

export class Yoda extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async start(): Promise<void> {
        // message, rawInputEscaped
        app.sbot.doAction("Read My Message", { "message": this.triggerData.message });
    }
}