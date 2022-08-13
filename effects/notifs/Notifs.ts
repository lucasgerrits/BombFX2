import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Logger } from '../../app/Logger.js';
import { Reward } from '../../app/twitch/Reward.js';
import { SFX } from '../sfx/SFX.js';
import { Twitch } from '../../app/twitch/Twitch.js';
import { Util } from '../../app/Util.js';

declare var app: BombFX;

export class NotifsReward extends Reward {
    public static override id: string = "e6151bd1-7e1a-4bf6-825e-4ecddb5e6617";
    public static override title: string = "Notification Troll Roulette";
    public static override cost: number = 100;

    constructor() {
        super(NotifsReward.id, NotifsReward.title, new Notifs());
    }
}

export class Notifs extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        let chance: number = Util.Math.getRandomIntegerInclusive(1, 100);
        // Logger.log("Discord Notif Chance: " + chance);

        if (chance > 6) {
            this.discordPrank();
            return;
        }
        
        let call: DiscordCall | LewdCall = (chance <= 1) ? new LewdCall() : new DiscordCall();
        call.setTriggerData(this.triggerData);
        app.queues.main.push(call);
    }

    private async discordPrank(): Promise<void> {
        let milliMin: number = 30000; // 30000 - 30 seconds
        let milliMax: number = 300000; // 300000 - 5 minutes
        let spamMilliMin: number = 100;
        let spamMilliMax: number = 1000;
        
        let milliseconds: number = Math.floor(Math.random() * (milliMax - milliMin) + milliMin);
        let amount: number = Math.floor(Math.random() * 5 + 1);
        
        await Util.sleep(milliseconds); // Initial pause before spam

        let user: string = this.triggerData.user;
        Logger.noise("Discording by " + user + " " + amount + " time(s) after " + (milliseconds/1000) + " seconds.");

        for (let i: number = 0; i < amount; i++) {
            SFX.play("discord");
            let sleepMilli = Math.floor(Math.random() * (spamMilliMax - spamMilliMin) + spamMilliMin);
            // Logger.log(`${sleepMilli}`);
            await Util.sleep(sleepMilli);
        }
        // app.twitch.bot.say(user + " generated " + amount + " fake Discord notifications after " + (milliseconds/1000) + " seconds. Tee hee");
    }
}

export class LewdCall extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }

    public override async start(): Promise<void> {
        app.twitch.bot.say("There was a 1% chance that " + 
            this.triggerData.user + " would make a sexy Discord call! uwu daddy");

        await app.obs.showSource("Discord Call Lewd", "Discord Call");
        await Util.sleep(15000);
        await app.obs.hideSource("Discord Call Lewd", "Discord Call");
    }
}

export class DiscordCall extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }

    public override async start(): Promise<void> {
        let scene: string = "Discord Call";

        app.twitch.bot.say("There was a 5% chance that " + 
            this.triggerData.user + " would Discord call the stream, and they did!");

        let imgURL: string = await app.twitch.profilePic(this.triggerData.user, 150);

        await app.obs.setBrowserURL("Discord Call Avatar", imgURL);

        await app.obs.setText("Discord Call Username", this.triggerData.user);

        await app.obs.showSource("Discord Call Dot Webm", scene);
        await app.obs.showSource("Discord Call Avatar", scene);
        await app.obs.showSource("Discord Call Username", scene);
        await Util.sleep(13100);

        await app.obs.hideSource("Discord Call Avatar", scene);
        await app.obs.hideSource("Discord Call Username", scene);
        await Util.sleep(1000);
        await app.obs.hideSource("Discord Call Dot Webm", scene);
    }
}