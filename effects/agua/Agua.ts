import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class AguaReward extends Reward {
    public static override id: string = "67907311-e073-458e-8bee-e06b3bc14138";
    public static override title: string = "AGUA v2";
    public static override cost: number = 499;
    
    constructor() {
        super(AguaReward.id, AguaReward.title, new Agua());
    }
}

export class Agua extends Effect {
    constructor() {
        super(EffectQueueName.Camera);
    }
    
    public override async start(): Promise<void> {
        // Chatbot message
        app.twitch.bot.say("It may not be milk, but it is important to stay hydrated. Prost!");

        // Turn on both videos
        await app.obs.showSource("New Water Dot Webm", "** Webcam");
        await Util.sleep(1000);

        // Turn on voicemod settings
        await app.sbot.setVoicemod("Underwater");
        // Swap mic/aux devices
        await app.obs.muteMic(true);

        // Play The Sound TM
        Util.playSound("./effects/sfx/sounds/agua.mp3");
        await Util.sleep(13000);

        // Swap mic/aux devices back
        await app.obs.unmuteMic(true);
        await Util.sleep(3000);

        // Turn off both videos
        await app.obs.hideSource("New Water Dot Webm", "** Webcam");
    }
}