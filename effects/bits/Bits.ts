import { BombFX } from '../../app/BombFX.js';
import { Logger } from '../../app/Logger.js';
import { Util } from '../../app/Util.js';
import type { CheerEventData } from '../../types/ComfyTypes.js';

declare var app: BombFX;

export class Bits {

    public static handler(data: CheerEventData) {
        Bits.rupees(data.bits);

        /**
        if (bits === 25 && message.length !== 0) {
            soundEffectRedemption(message, 1.0);
        }
        else if (bits === 25 && message.length === 0) {
            soundEffectRedemption("wednesday", 1.0);
        }
        */
    }

    public static async rupees(bits: number) {
        let bitSource: string = "Bit Rupee ";

        if (bits < 100) {
            bitSource += "1";
        } else if (bits >= 100 && bits < 1000) {
            bitSource += "2";
        } else if (bits >= 1000 && bits < 5000) {
            bitSource += "3";
        } else if (bits >= 5000 && bits < 10000) {
            bitSource += "4";
        } else if (bits >= 10000) {
            bitSource += "5";
        } else {
            Logger.log("Looks like some kind of weird bit logic, CFB.");
        }
    
        app.obs.showSource(bitSource, "** Bit Rupees");
        await Util.sleep(2500);
        app.obs.hideSource(bitSource, "** Bit Rupees");
    }
}