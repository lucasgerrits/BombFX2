import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class Timeout extends Effect {
    constructor() {
        super(EffectQueueName.Timeouts);
    }
    // changes
    public override async start(): Promise<void> {
        const scene: string = "MvC";

        // Get and set moderator's profile picture
        const picURL: string = await app.twitch.profilePic(this.triggerData.user, 600);
        await app.obs.setBrowserURL("MvC User", picURL);

        // Show media sources
        app.obs.showSource("MvC BG", scene);
        app.obs.showSource("MvC Slider", scene);

        // Show browser source and enable move source filters for profile pic
        app.obs.showSource("MvC User", scene);
        app.obs.showFilter(scene, "MvC User In");

        // Wait duration
        await Util.sleep(1500);

        // Hide browser source and media sources
        app.obs.hideSource("MvC User", scene);
        app.obs.hideSource("MvC BG", scene);
        app.obs.hideSource("MvC Slider", scene);
    }
}