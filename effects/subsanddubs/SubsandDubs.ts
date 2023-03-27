import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import { subsAndDubsVoices } from "./subsAndDubsVoiceList.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class SubsAndDubsReward extends Reward {
    public static override id: string = "28fdee0e-b4fa-4014-94c1-37b157bd3aa8";
    public static override title: string = "Subs & Dubs";
    public static override cost: number = 100;

    constructor() {
        super(SubsAndDubsReward.id, SubsAndDubsReward.title, new SubsAndDubs());
    }
}

export class SubsAndDubs extends Effect {
    protected textQueue: Array<string>;
    protected speechListener: () => void = null;

    constructor() {
        super(EffectQueueName.Main);
        //this.textQueue = new Array<string>();
    }

    protected async onNewText(): Promise<void> {
        const text: string = app.speech.textQueue.shift();
        this.textQueue.push(text);
        Logger.noise("Made it!: " + text);
    }
    
    public override async start(): Promise<void> {
        // Get voice data from user redemption text
        const voice: string = this.cleanTriggerText(this.triggerData.message);

        // Determine if user text contains an actual voice name
        if (!(voice in subsAndDubsVoices)) {
            app.twitch.bot.say("Sorry, " + this.triggerData.user + ", but that is not an available voice choice.");
            return;
        }

        // Get duration of specified voice effect
        const durationInSeconds: number = subsAndDubsVoices[voice].duration;

        // Enable speech recognition
        this.speechListener = () => { this.onNewText(); };
        //window.addEventListener("RecognizedSpeechText", this.speechListener);
        await app.speech.startRecognition();

        this.textQueue = subsAndDubsVoices[voice].effect.textQueue;

        // Start specified speech effect
        subsAndDubsVoices[voice].effect.start();

        // Await duration
        await Util.sleep(durationInSeconds * 1000);
        
        // Stop specified speech effect
        subsAndDubsVoices[voice].effect.stop();
        
        // Stop speech recognition
        await app.speech.stopRecognition();
        //window.removeEventListener("RecognizedSpeechText", this.speechListener);
        this.speechListener = null;
    }
}