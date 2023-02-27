import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { PauseReward } from "../pause/Pause.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class BigPPReward extends Reward {
    public static override id: string = "dcee19bc-a239-416c-bfeb-dd01d8f7d71c";
    public static override title: string = "The Big PP";
    public static override buttonColor: string = "#380835";
    public static override cost: number = 100000;
    
    constructor() {
        super(BigPPReward.id, BigPPReward.title, new BigPP(), BigPPReward.buttonColor);
    }
}

export class BigPP extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async setup(): Promise<void> {
        PauseReward.pause();
    }

    public override async dismantle(): Promise<void> {
        PauseReward.resume();
    }

    public override async start(user: string = this.triggerData.user): Promise<void> {
        const ppScene: string = "The Big PP";

        // Set username to text source
        await app.obs.setText("The Big PP User Text", user);

        // Get URL for Twitch avatar and set to browser source
        const imgURL: string = await app.twitch.profilePic(user, 150);
        await app.obs.setBrowserURL("The Big PP Twitch Pic", imgURL);

        // Dim the background
        app.obs.showFilter("The Big PP Black", "Move Value Opacity");

        this.botSpam(user);

        // Show webm
        await app.obs.showSource("The Big PP Mountain", ppScene);

        // Reset position of pic just in case it wasn't done properly last time
        await app.obs.showFilter(ppScene, "Move Source Reset");
        await Util.sleep(500);

        // Show profile pic
        await app.obs.showSource("The Big PP Twitch Pic", ppScene);

        // Start profile pic move filter chain
        await app.obs.showFilter("The Big PP", "Move Source 1");
        await Util.sleep(6000);

        // Show username
        await app.obs.showSource("The Big PP User Text", ppScene);
        await app.obs.showSource("The Big PP User Text Shadow", ppScene);
        await Util.sleep(2000);

        // Show additional text
        await app.obs.showSource("The Big PP Additional Text", ppScene);
        await app.obs.showSource("The Big PP Additional Text Shadow", ppScene);
        await Util.sleep(11000);

        // Hide profile pic
        app.obs.hideSource("The Big PP Twitch Pic", ppScene);

        // Hide username
        app.obs.hideSource("The Big PP User Text", ppScene);
        app.obs.hideSource("The Big PP User Text Shadow", ppScene);

        // Hide additional text
        app.obs.hideSource("The Big PP Additional Text", ppScene);
        app.obs.hideSource("The Big PP Additional Text Shadow", ppScene);

        // Remove background dim
        app.obs.showFilter("The Big PP Black", "Move Value Reset");
        await Util.sleep(1000);

        // Hide webm
        app.obs.hideSource("The Big PP Mountain", ppScene);

        // Reset position of profile pic
        app.obs.showFilter(ppScene, "Move Source Reset");
    }

    private async botSpam(user: string): Promise<void> {
        app.twitch.chat.sbotAnnouncement("...OH SHIT pikaOMG");
        await Util.sleep(1700);
        app.twitch.chat.sbotAnnouncement("cfbTurboBongo THIS IS NOT A DRILL!! cfbTurboBongo");
        await Util.sleep(1700);
        app.twitch.chat.sbotAnnouncement(user + " NOW HAS...");
        await Util.sleep(1700);
        app.twitch.chat.sbotAnnouncement("THE BIG SpeedL BigPP SpeedR !!!");
    }
}