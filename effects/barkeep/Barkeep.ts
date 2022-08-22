import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Logger } from '../../app/Logger.js';
import { Util } from '../../app/util/Util.js';

declare var app: BombFX;

export class Barkeep extends Effect {
    private message: string = "";

    constructor(message?: string) {
        super(EffectQueueName.Barkeep, true);
        if (message != null) {
            this.message = message;
        }
    }
    
    public override async start(): Promise<void> {
        if (this.triggerData !== undefined) {
            this.message = this.triggerData.message;
        }

        await app.obs.showSource("Barkeep - In", "Barkeep");

        await Util.sleep(770);

        await app.obs.showSource("Barkeep - Loop", "Barkeep");

        await app.obs.hideSource("Barkeep - In", "Barkeep");

        app.tts.say(this.message);

        app.tts.speaker.onended = async () => {
            Logger.tts("Barkeep TTS ended.");

            await app.obs.showSource("Barkeep - Out", "Barkeep");
    
            await Util.sleep(100);

            await app.obs.hideSource("Barkeep - Loop", "Barkeep");
    
            await Util.sleep(1000);
    
            await app.obs.hideSource("Barkeep - Out", "Barkeep");

            await app.obs.restartMedia("Barkeep - In");
            await app.obs.restartMedia("Barkeep - Loop");
            await app.obs.restartMedia("Barkeep - Out");

            this.emitStop();
        }
    }
}