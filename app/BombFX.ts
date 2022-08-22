import { EffectQueue } from './EffectQueue.js';
import { Heat } from './twitch/Heat.js';
import { Logger } from './Logger.js';
import { OBSSocket } from './obs/OBSSocketV5.js';
import { Orb } from '../effects/orb/Orb.js';
import { SFX } from '../effects/sfx/SFX.js';
import { SpeechRecognition } from './integrations/SpeechRecognition.js';
import { StreamerBotSocket } from './integrations/StreamerBotSocket.js';
import { TextToSpeech } from './integrations/TextToSpeech.js';
import { TimerMap } from './Timer.js';
import { Twitch } from './twitch/Twitch.js';
import { Util } from './util/Util.js';
import type { EffectQueueBucket } from '../types/AppTypes';

declare var window: any;

export class BombFX {

    public queues: EffectQueueBucket;
    public obs: OBSSocket;
    public sbot: StreamerBotSocket;
    public SFX: SFX;
    public timers: TimerMap;
    public twitch: Twitch;
    public tts: TextToSpeech;
    public speech: SpeechRecognition;
    public heat: Heat;
    public Util: Util;

    constructor() {
        Logger.bomb("Bomb FX 2 Loading...");
        
        this.tts = new TextToSpeech();
        this.sbot = new StreamerBotSocket();
        this.twitch = new Twitch();
        this.obs = new OBSSocket();
        this.speech = new SpeechRecognition();
        this.heat = new Heat();
        
        this.timers = new TimerMap();
        this.setEffectQueues();
        
        this.SFX = SFX;
        this.Util = Util;

        this.setWindowGlobals();
        this.testGrounds();
    }

    private setEffectQueues(): void {
        this.queues = {
            main: new EffectQueue(4),
            barkeep: new EffectQueue(2),
            media: new EffectQueue(1),
            toads: new EffectQueue(3),
            jump: new EffectQueue(1),
            crimbob: new EffectQueue(1),
            zora: new EffectQueue(1),
            camera: new EffectQueue(1),
            scene: new EffectQueue(2),
            none: new EffectQueue(-1)
        };
    }

    private setWindowGlobals(): void {
        // Classes
        window.SFX = SFX;
        window.Util = Util;

        // Functions
        window.pauseAll = () => { this.twitch.rewards.pauseAll(); };
        window.resumeAll = () => { this.twitch.rewards.resumeAll(); };
        window.createNewReward = Twitch.createNewReward;
        window.dismissOrb = Orb.dismiss;

        window.startRecog = () => { this.speech.startRecognition(); };
        window.stopRecog = () => { this.speech.stopRecognition(); };
    }

    private async testGrounds(): Promise<void> {
        await Util.sleep(1000);

        
    }
}