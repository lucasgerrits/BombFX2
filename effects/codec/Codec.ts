import { BattletoadsReward } from '../battletoads/Battletoads.js';
import { BombFX } from '../../app/BombFX.js';
import { specifiedVoices } from '../../data/specifiedvoices.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Logger } from '../../app/Logger.js';
import { Reward } from '../../app/twitch/Reward.js';
import { TextToSpeech } from '../../app/TextToSpeech.js';
import { Twitch } from '../../app/twitch/Twitch.js';
import { Util } from '../../app/Util.js';

declare var app: BombFX;

export class CodecReward extends Reward {
    public static override id: string = "365a5c68-a74c-480f-9a6e-647b159e421e";
    public static override title: string = "Codec Call";
    public static override cost: number = 500;

    constructor() {
        super(CodecReward.id, CodecReward.title, new Codec());
    }
}

export class Codec extends Effect {
    private voiceMap: Map<string, string>;
    
    constructor() {
        super(EffectQueueName.Main, true);
        this.voiceMap = new Map<string, string>();
        this.fillVoiceMap();
    }
    
    public override async setup(): Promise<void> {
        BattletoadsReward.pause();
    }

    public override async dismantle(): Promise<void> {
        BattletoadsReward.resume();
    }

    public override async start(): Promise<void> {
        let currentScene: string = await app.obs.getCurrentSceneName();

        let user: string = this.triggerData.user;
        let message: string = this.triggerData.message;

        if (Util.String.containsBadWords(message)) {
            message = "This message has been censored for bad language.";
            user = "Twitch";
        }

        // Change Twitch profile pic's URL
        let picURL: string = await app.twitch.profilePic(user, 600);
        await app.obs.setBrowserURL("Codec Call Twitch Pic", picURL);

        // Ring ring ring, ring ring ring, phone call, phone call
        await app.obs.showSource("Codec Ring", "** Videos");
        
        // Set content of text box
        await app.obs.setText("Codec Call Text", message);
        await Util.sleep(3000);

        await app.obs.setScene("Codec Call");

        await app.obs.hideSource("Codec Ring", "** Videos");

        // If coming from another scene, wait for transition
        if (currentScene !== "Codec Call") {
            await Util.sleep(4600);
        }

        try {
            if (this.voiceMap.has(user)) {
                app.tts.say(message, this.voiceMap.get(user));
            } else {
                app.tts.say(message, "random");
            }
            
            app.tts.speaker.onended = async () => {
                Logger.tts("Codec TTS ended.");
                await Util.sleep(1000);
                await app.obs.setScene(currentScene);
                await Util.sleep(2500);
                this.emitStop();
            }
        } catch (err: unknown) {
            Logger.tts("Catch block: ");
            console.log(err);
            await app.obs.setScene(currentScene);
        }
    }

    private fillVoiceMap() {
        for (let i: number = 0; i < specifiedVoices.length; i++) {
            this.voiceMap.set(specifiedVoices[i].user, specifiedVoices[i].voice);
        }
    }
}