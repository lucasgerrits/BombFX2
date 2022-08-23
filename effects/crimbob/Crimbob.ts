import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class CrimbobReward extends Reward {
    public static override id: string = "e8c03736-ff37-42e8-883e-d8a53d3831e5";
    public static override title: string = "MERTY CRIMBOB";
    public static override buttonColor: string = "#005025";
    public static override cost: number = 50;

    constructor() {
        super(CrimbobReward.id, CrimbobReward.title, new Crimbob());
    }
}

export class Crimbob extends Effect {
    constructor() {
        super(EffectQueueName.Crimbob);
    }
    
    public override async start(): Promise<void> {
        app.twitch.bot.say("MERTY CRIMBOB, " + this.triggerData.user + "!");

        await app.obs.showSource("Merty Crimbob OG", "** Mega Overlay");

        Util.playSound("effects/crimbob/mertycrimbobquieter.mp3");

        await Util.sleep(4200); // he he weed number

        await app.obs.hideSource("Merty Crimbob OG", "** Mega Overlay");
    }
}