import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/util/Util.js';

declare var app: BombFX;

export class SunnyReward extends Reward {
    public static override id: string = "ae695f5f-c931-48fa-bc57-27b4f5c703aa";
    public static override title: string = "It's Always Sunny";
    public static override cost: number = 600;

    constructor() {
        super(SunnyReward.id, SunnyReward.title, new Sunny());
        this.allowedOnBRB = true;
    }
}

export class Sunny extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async start(): Promise<void> {
        Util.playSound("effects/sunny/sunnythemeclip.mp3");

        // Check user input for offensive terms
        let episodeTitle: string = this.triggerData.message;
        if (Util.Strings.containsBadWords(episodeTitle)) {
            episodeTitle = "The Gang Scolds " + this.triggerData.user + " for Being a Big Dangus";
            let modStr: string = "/timeout " + this.triggerData.user + " 300 No Brain";
            app.twitch.bot.say(modStr, true);
        }

        // Create black background box
        let fxDiv: HTMLElement = document.getElementById("fx-box");
        let bgDiv: HTMLDivElement = document.createElement("div");
        bgDiv.setAttribute("id", "sunnyBG");

        // Create text box and fill with episode title
        let textDiv: HTMLDivElement = document.createElement("div");
        textDiv.setAttribute("id", "sunnyText");
        let titleString: string = "&ldquo; " + Util.Strings.titleCase(episodeTitle) + " &rdquo;";
        textDiv.innerHTML = titleString;

        // Add to page
        bgDiv.appendChild(textDiv);
        fxDiv.appendChild(bgDiv);

        // Switch text to show and channel title
        await Util.sleep(4200);
        textDiv.innerHTML = "FX Presents<br><br>It's Always Sunny<br>in Philadelphia";

        // Switch text to starring credits
        await Util.sleep(2200);
        let starringString: string = "Starring<br><br>" + this.triggerData.user + "<br>";
        if (this.triggerData.user !== "CareFreeBomb") {
            starringString += "CareFreeBomb<br>";
        }
        starringString += "Degen Twitch Chat";
        textDiv.innerHTML = starringString;

        // Sound length is 7.707 seconds
        await Util.sleep(1400);
        bgDiv.removeChild(textDiv);
        fxDiv.removeChild(bgDiv);
    }
}