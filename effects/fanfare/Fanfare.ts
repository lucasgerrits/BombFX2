import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/util/Util.js';

declare var app: BombFX;

export class FanfareReward extends Reward {
    public static override id: string = "1775c2fa-caee-4f24-8f55-c99a56c5a819";
    public static override title: string = "Item Fanfare";
    public static override cost: number = 400;

    constructor() {
        super(FanfareReward.id, FanfareReward.title, new Fanfare());
        this.allowedOnBRB = true;
    }
}

export class Fanfare extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async start(): Promise<void> {
        Util.playSound("effects/fanfare/fanfare.mp3");
        
        // Check user input for offensive terms
        let itemName: string = this.triggerData.message;
        if (Util.String.containsBadWords(itemName)) {
            itemName = this.triggerData.user + " is a dickhead who uses offensive language.";
            let modStr: string = "/timeout " + this.triggerData.user + " 300 No Brain";
            app.twitch.bot.say(modStr, true);
        }

        // Create HTML elements
        let fxDiv: HTMLElement = document.getElementById("fx-box");
        let metroidItemDiv: HTMLDivElement = document.createElement("div");
        metroidItemDiv.setAttribute("id", "metroid-item-box");
        metroidItemDiv.textContent = itemName;
        fxDiv.appendChild(metroidItemDiv);
        metroidItemDiv.classList.add("item-box-grow");

        // Remove HTML elements
        await Util.sleep(6100);
        metroidItemDiv.classList.remove("item-box-grow");
        metroidItemDiv.classList.add("item-box-shrink");
        await Util.sleep(280);
        fxDiv.removeChild(metroidItemDiv);
    }
}