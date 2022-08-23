import { BattletoadsReward } from "../battletoads/Battletoads.js";
import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { SFXDoubleSpeedReward, SFXQuarterSpeedReward, SFXReward } from "../sfx/SFX.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class PanicSwitchReward extends Reward {
    public static override id: string = "93301807-d1a5-4225-a0e0-bfdb4f9ad825";
    public static override title: string = "Panic Switch";
    public static override cost: number = 4000;

    constructor() {
        super(PanicSwitchReward.id, PanicSwitchReward.title, new PanicSwitch());
        this.allowedOnBRB = true;
    }
}

export class PanicSwitch extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async setup(): Promise<void> {
        const newColor: string = "#9E0B0F";
        BattletoadsReward.update({ cost: 2000, title: BattletoadsReward.title + " (Panic)", background_color: newColor });
        SFXReward.update({ cost: 10, title: SFXReward.title + " (Panic)", background_color: newColor });
        SFXDoubleSpeedReward.update({ cost: 1, title: SFXDoubleSpeedReward.title + " (Panic)", background_color: newColor });
        SFXQuarterSpeedReward.update({ cost: 20, title: SFXQuarterSpeedReward.title + " (Panic)", background_color: newColor });
    }

    public override async dismantle(): Promise<void> {
        BattletoadsReward.update({ cost: 300, title: BattletoadsReward.title, background_color: BattletoadsReward.buttonColor });
        SFXReward.update({ cost: 250, title: SFXReward.title, background_color: SFXReward.buttonColor });
        SFXDoubleSpeedReward.update({ cost: 150, title: SFXDoubleSpeedReward.title, background_color: SFXDoubleSpeedReward.buttonColor });
        SFXQuarterSpeedReward.update({ cost: 700, title: SFXQuarterSpeedReward.title, background_color: SFXQuarterSpeedReward.buttonColor });
    }

    public override async start(): Promise<void> {
        const duration: number = 90;
        const warning: number = 10;

        const durationInMS: number = duration * 1000;
        const warningInMS: number = warning * 1000;

        Util.playSound("effects/panic/alarm.mp3");

        const panicStr: string = "/announce ThisIsFine elmoFire " + this.triggerData.user + 
            " has flipped the Panic Switch!! Sound Effects (and double speed)" +
            " now cost only 1 PP, 1/4 Speed Sounds are also discounted to 20 PP," +
            " and Battletoads has inflated to 2000 PP for the next " + duration + 
            " seconds!! elmoFire ThisIsFine";
        app.twitch.bot.say(panicStr, true);

        await Util.sleep(durationInMS - warningInMS);

        const warningStr: string = "/announce WARNING!! ONLY " + warning +
            " SECONDS REMAIN!!";
        app.twitch.bot.say(warningStr, true);
        
        await Util.sleep(warningInMS);

        const orderStr: string = "/announce Order has been restored. Sound Effects," + 
            " Double Speed, 1/4 Speed, and Battletoads are now back to their original costs.";
        app.twitch.bot.say(orderStr, true);

        Util.playSound("effects/panic/alarm.mp3");
    }
}