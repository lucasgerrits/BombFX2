import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Logger } from '../../app/Logger.js';
import { Util } from '../../app/Util.js';

declare var app: BombFX;

export class Barkeep extends Effect {
    constructor() {
        super(EffectQueueName.Barkeep, true); //
    }
    
    public override async start(): Promise<void> {
        await app.obs.showSource("Barkeep - In", "Barkeep");

        await Util.sleep(770);

        await app.obs.showSource("Barkeep - Loop", "Barkeep");

        await app.obs.hideSource("Barkeep - In", "Barkeep");

        app.tts.say(this.triggerData.message);

        app.tts.speaker.onended = async () => {
            Logger.tts("Barkeep TTS ended.");

            await app.obs.showSource("Barkeep - Out", "Barkeep");
    
            await Util.sleep(100);

            await app.obs.hideSource("Barkeep - Loop", "Barkeep");
    
            await Util.sleep(1000);
    
            await app.obs.hideSource("Barkeep - Out", "Barkeep");

            await app.obs.send("RestartMedia", { "sourceName": "Barkeep - In" });
            await app.obs.send("RestartMedia", { "sourceName": "Barkeep - Loop" });
            await app.obs.send("RestartMedia", { "sourceName": "Barkeep - Out" });

            this.emitStop();
        }
    }
}