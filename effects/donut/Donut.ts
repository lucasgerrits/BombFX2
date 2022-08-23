
import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class DonutBreakReward extends Reward {
    public static override id: string = "464f44f6-3987-4bf3-9b7e-ba13b9ba22db";
    public static override title: string = "Donut Break";
    public static override cost: number = 400;

    constructor() {
        super(DonutBreakReward.id, DonutBreakReward.title, new DonutBreak());
    }
}

export class DonutBreak extends Effect {
    public static active: boolean = false;

    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async start(): Promise<void> {
        const duration: number = 45;
        const durationInMS: number = duration * 1000;

        DonutBreak.active = true;

        const chatStr = "/announce ATTENTION D O N U T ENTHUSIASTS - For the next " + 
            duration + " seconds, you may only post carefr3DONUT in chat. Please " + 
            "enjoy this delicious snack break brought to you by " + this.triggerData.user + "!!";
        app.twitch.bot.say(chatStr, true);

        await Util.sleep(durationInMS);

        const chatStr2 = "/announce ATTENTION D O N U T ENTHUSIASTS - Regular chat " +
            "activity may now resume.";
        app.twitch.bot.say(chatStr2, true);

        DonutBreak.active = false;
    }

    public static handler(user: string, message: string, messageID: string): void {
        // If the break is currently enabled:
        if (DonutBreak.active === true) {
            // Then check if passed in message qualifies
            if (!DonutBreak.isDonutMessage(message)) {
                // If not, YEET
                app.twitch.chat.deleteMessage(messageID);
            }
        }
    }

    private static isDonutMessage(message: string): boolean {
        if (Util.Strings.checkAlphanumeric(message)) {
            const regex: RegExp = /^carefr3DONUT(\scarefr3DONUT)*$/g;
            return regex.test(message);
        } else {
            return false;
        }
    }
}