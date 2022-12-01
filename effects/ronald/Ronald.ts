import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class RonaldReward extends Reward {
    public static override id: string = "a7e45577-bac4-4b95-94b8-d3ba8b37e4a4";
    public static override title: string = "Ronald";
    public static override cost: number = 150;

    constructor() {
        super(RonaldReward.id, RonaldReward.title, new Ronald());
    }
}

export class Ronald extends Effect {
    constructor() {
        super(EffectQueueName.Ronald);
    }
    
    public override async start(): Promise<void> {
        const chance: number = 33;
        const roll: number = Util.Numbers.getRandomIntegerInclusive(0, 100);
        app.twitch.bot.say(this.triggerData.user + "'s Ronald Roll: " + roll);
        if (roll === 24) {
            app.twitch.chat.say("/timeout " + this.triggerData.user + " 2400 24");
            app.twitch.bot.say("̵͊́[̴͑̋2̶͗̈́]̸͐̾[̷͊̒4̷̌͘]̷̔̍");
        } else if (roll <= chance) {
            app.twitch.chat.say("/timeout " + this.triggerData.user + " 300 Ronald Gamba");
            app.twitch.bot.say("Fuck you, " + this.triggerData.user);
        } else {
            await app.obs.showSource("Ronald Dot Webm", "** Videos");
            await Util.sleep(1500);
            await app.obs.hideSource("Ronald Dot Webm", "** Videos");
        }
    }
}