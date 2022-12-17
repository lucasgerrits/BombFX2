import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class TwizzieReward extends Reward {
    public static override id: string = "e5d00cab-6526-410a-8c7e-fb34335b57c7";
    public static override title: string = "Rip a Twizzie";
    public static override cost: number = 100;

    constructor() {
        super(TwizzieReward.id, TwizzieReward.title, new TwizzieRip());
    }
}

export class TwizzieRip extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        await app.obs.showSource("Heathers", "** Mega Overlay");
        Util.playSound("effects/stuff/gripnrip.mp3");

        await Util.sleep(5000);
        await app.obs.hideSource("Heathers", "** Mega Overlay");
    }
}