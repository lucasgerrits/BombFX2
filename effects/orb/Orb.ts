import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/Util.js';

declare var app: BombFX;

export class OrbReward extends Reward {
    public static override id: string = "56c1aa5d-ca50-4cfb-aa07-3fff21ba9da0";
    public static override title: string = "The Orb™";
    public static override cost: number = 750;
    
    constructor() {
        super(OrbReward.id, OrbReward.title, new Orb());
    }
}

export class Orb extends Effect {
    constructor() {
        super(EffectQueueName.Main, true);
    }
    
    public override async start(): Promise<void> {
        let scene: string = "** Webcam";
        let cfbCamSourceMirror: string = "Webcam Greenscreen Mirror";
        let fullCamSourceMirror: string = "Webcam BG Mirror";

        Util.playSound("effects/orb/audio/orb.mp3");

        // Enable orb upward movement
        await app.obs.showFilter(scene, "Move Orb Up");

        // Enable Webcam BG Mirror
        await app.obs.showSource(fullCamSourceMirror, scene);

        // Enable Webcam Greenscreen
        await app.obs.showSource(cfbCamSourceMirror, scene);

        // Enable Greenscreen filter for Greenscreen Mirror
        await app.obs.showFilter(cfbCamSourceMirror, "Virtual Greenscreen");

        // Swap greenscreen mode to make stupid filter work lol
        await app.obs.send("SetSourceFilterSettings", {
            "sourceName" : cfbCamSourceMirror,
            "filterName" : "Virtual Greenscreen",
            "filterSettings" : {
                "Commit" : "g81a96998",
                "NVIDIA.Greenscreen.Mode" : 1,
                "Version" : 47244705792
            }
        }); // Performance

        await Util.sleep(1000); // REQUIRED PAUSE

        await app.obs.send("SetSourceFilterSettings", {
            "sourceName" : cfbCamSourceMirror,
            "filterName" : "Virtual Greenscreen",
            "filterSettings" : {
                "Commit" : "g81a96998",
                "NVIDIA.Greenscreen.Mode" : 0,
                "Version" : 47244705792
            }
        }); // Quality

        // Show background move value filter (darken mirror)
        app.obs.showFilter(fullCamSourceMirror, "Move Value - Orb Coloring Show");

        // Show greenscreen move value filter (blue cfb)
        app.obs.showFilter(cfbCamSourceMirror, "Move Value - Orb Color Show");
        app.obs.showFilter(cfbCamSourceMirror, "Move Value - Orb Grading Show");

        this.chatText(this.triggerData.user);

        // Wait remaining duration of audio to disable
        await Util.sleep(13000);

        // Orb and effects remain until question is answered
        // So move to next effect in queue
        app.queues.main.next();
    }

    public static async stop(): Promise<void> {
        let scene: string = "** Webcam";
        let cfbCamSourceMirror: string = "Webcam Greenscreen Mirror";
        let fullCamSourceMirror: string = "Webcam BG Mirror";

        Util.playSound("effects/orb/audio/orb2.mp3");

        // Enable Orb downward movement
        app.obs.showFilter(scene, "Move Orb Down");

        // Undo background move value filter (darken mirror)
        app.obs.showFilter(fullCamSourceMirror, "Move Value - Orb Coloring Hide");

        // Undo greenscreen move value filters (blue cfb)
        app.obs.showFilter(cfbCamSourceMirror, "Move Value - Orb Color Hide");
        app.obs.showFilter(cfbCamSourceMirror, "Move Value - Orb Grading Hide");

        // Wait remaining duration of audio to disable
        await Util.sleep(13000);

        // Disable Greenscreen filter for Greescreen Mirror
        await app.obs.hideFilter(cfbCamSourceMirror, "Virtual Greenscreen");

        // Disable Webcam BG Mirror
        await app.obs.hideSource(fullCamSourceMirror, scene);

        // Disable Webcam Greenscreen
        await app.obs.hideSource(cfbCamSourceMirror, scene);
    }

    private async chatText(user: string): Promise<void> {
        await Util.sleep(7000);
        app.twitch.bot.say(user + " has summoned...");
        await Util.sleep(5000);
        app.twitch.bot.say("OrbOrb The Orb OrbOrb");
    }
}