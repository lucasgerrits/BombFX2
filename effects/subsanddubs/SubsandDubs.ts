import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Logger } from '../../app/Logger.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/util/Util.js';

declare var app: BombFX;

export class SubsandDubsReward extends Reward {
    public static override id: string = "28fdee0e-b4fa-4014-94c1-37b157bd3aa8";
    public static override title: string = "Subs & Dubs";
    public static override cost: number = 100;

    constructor() {
        super(SubsandDubsReward.id, SubsandDubsReward.title, new SubsandDubs());
    }
}

export class SubsandDubs extends Effect {
    protected textQueue: Array<string>;
    protected speechListener: () => void = null;

    constructor() {
        super(EffectQueueName.Main);
        this.textQueue = new Array<string>();
    }

    protected async onNewText(): Promise<void> {
        const text: string = app.speech.textQueue.shift();
        this.textQueue.push(text);
        Logger.noise("Made it!: " + text);
    }
    
    public override async start(): Promise<void> {
        this.speechListener = () => { this.onNewText(); }
        window.addEventListener("RecognizedSpeechText", this.speechListener);

        app.speech.startRecognition();

        await Util.sleep(10000);
        
        app.speech.stopRecognition();

        window.removeEventListener("RecognizedSpeechText", this.speechListener);
        this.speechListener = null;
    }
}