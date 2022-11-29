import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class WeatherReward extends Reward {
    public static override id: string = "927aee45-c5d2-4550-804f-8019fe5325fd";
    public static override title: string = "Appleton Cam";
    public static override cost: number = 100;

    constructor() {
        super(WeatherReward.id, WeatherReward.title, new WeatherCheck());
    }
}

export class WeatherCheck extends Effect {

    private durationSeconds: number = 15;    

    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        // Show nested scene
        await app.obs.showSource("Weather", "** Mega Overlay");

        // Give it a few seconds to load in city cam
        await Util.sleep(3000);

        // Turn on the filter that slides scene in
        await app.obs.showFilter("** Mega Overlay", "Move Source - Show");

        // Wait amount of time it should be visible on screen
        await Util.sleep(this.durationSeconds * 1000);

        // Turn on the filter that slides scene out
        await app.obs.showFilter("** Mega Overlay", "Move Source - Hide");

        // Give some time for slide out and then hide nested scene
        await Util.sleep(1500);
        await app.obs.showSource("Weather", "** Mega Overlay");
    }
}