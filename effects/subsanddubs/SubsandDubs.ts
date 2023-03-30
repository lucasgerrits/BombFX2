import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import { subsAndDubsVoices } from "./subsAndDubsVoiceList.js";

import { ISubsAndDubsVoice } from "./ISubsAndDubsVoice.js";
import { SubsAndDubsVoice } from "./SubsAndDubsVoice.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class SubsAndDubsReward extends Reward {
    public static override id: string = "28fdee0e-b4fa-4014-94c1-37b157bd3aa8";
    public static override title: string = "Subs & Dubs";
    public static override cost: number = 1500;

    constructor() {
        super(SubsAndDubsReward.id, SubsAndDubsReward.title, new SubsAndDubs());
    }
}

export class SubsAndDubs extends Effect {
    protected textQueue: Array<string>;
    protected speechListener: () => void = null;
    protected currentVoice: ISubsAndDubsVoice & SubsAndDubsVoice;
    protected timer: number;

    constructor() {
        super(EffectQueueName.Main);
        //this.textQueue = new Array<string>();
    }

    protected async onNewText(): Promise<void> {
        const text: string = app.speech.textQueue.shift();
        this.textQueue.push(text);
        this.currentVoice.displayText(this.textQueue.shift());
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
        this.currentVoice = subsAndDubsVoices[voice].effect;

        // Enable speech recognition
        this.speechListener = () => { this.onNewText(); };
        window.addEventListener("RecognizedSpeechText", this.speechListener);
        await app.speech.startRecognition();
        
        // Start specified speech effect
        this.currentVoice.start();

        this.textQueue = this.currentVoice.textQueue;

        // Create remainingSeconds timer for individual effect display
        this.startTimer(durationInSeconds);

        // Await duration
        await Util.sleep((durationInSeconds * 1000) + 1500);
        
        // Stop specified speech effect
        await this.currentVoice.stop();
        
        // Stop speech recognition
        await app.speech.stopRecognition();
        window.removeEventListener("RecognizedSpeechText", this.speechListener);
        this.speechListener = null;

        // Clear the text queue
        this.textQueue = null;
    }

    private async startTimer(durationInSeconds: number): Promise<void> {
        this.currentVoice.remainingSeconds = durationInSeconds;
        this.timer = setInterval(() => {
            this.currentVoice.remainingTimeString = Util.Numbers.secToMinSec(this.currentVoice.remainingSeconds);
            this.currentVoice.updateTimer();
            this.currentVoice.remainingSeconds--;
            if (this.currentVoice.remainingSeconds < 0) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }, 1000);
    }
}