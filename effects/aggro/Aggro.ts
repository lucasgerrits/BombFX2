import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import { attacks } from "./attacks.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class AggroReward extends Reward {
    public static override id: string = "f4617fa6-2638-4d1b-89ad-15b9556aecd0";
    public static override title: string = "AGGRO";
    public static override cost: number = 100;

    constructor() {
        super(AggroReward.id, AggroReward.title, new Aggro());
    }
}

export class Aggro extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        // Get attack type from user input string
        const attack: string = this.triggerData.message;
        
        // Determine if attack list contains attack type
        if (!Object.prototype.hasOwnProperty.call(attacks, attack)) {
            // If it doesn't, shame chatter and end
            app.twitch.bot.say("Hey dingdong, ya done goofed");
            return;
        }

        // Attack!!
        attacks[attack]();
    }
}