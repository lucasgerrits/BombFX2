import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class FridayReward extends Reward {
    public static override id: string = "dcdec6ff-8406-4f84-9b19-9e9810d75b2e";
    public static override title: string = "Believe It";
    public static override cost: number = 400;
    
    constructor() {
        super(FridayReward.id, FridayReward.title, new Friday());
        this.allowedOnBRB = true;
    }
}

export class Friday extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async start(): Promise<void> {
        // Get the current day of the week
        const today: Date = new Date();
        const dayInt: number = today.getDay();

        // Check if not Friday
        if (dayInt !== 5) {
            // Yeet that dum dum
            app.twitch.chat.timeoutUser(this.triggerData.user, 300, "Not actually Friday.");
            const chatStr: string = this.triggerData.user + ", if yoooooooooouuuuuuuuuuu can believe it, you've been timed out once again!";
            app.twitch.bot.say(chatStr);
            return;
        }

        // Successfully Friday, play appropriate media source
        let video: string = "Friday Once Again";
        let duration: number = 13;

        // Determine if Jason Voorhees video
        const thirteenth: boolean = false;
        if (thirteenth) {
            video = "Friday the 13th Once Again";
            duration = 15;
        }

        // Show and stop media source
        await app.obs.showSource(video, "** Videos");
        await Util.sleep(duration * 1000);
        await app.obs.hideSource(video, "** Videos");
    }
}