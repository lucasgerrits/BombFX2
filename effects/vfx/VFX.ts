import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import type { VideoExistenceData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class VFXReward extends Reward {
    public static override id: string = "bfa26c90-4ac2-4487-89ab-aca34c65fd59";
    public static override title: string = "VFX";
    public static override cost: number = 150;

    constructor() {
        super(VFXReward.id, VFXReward.title, new VFX());
        this.allowedOnBRB = true;
    }
}

export class VFX extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async start(): Promise<void> {
        
        // Modify input string
        const message: string = this.cleanTriggerText(this.triggerData.message);

        // Make sure no weird invisible characters got through because twitch
        if (!Util.Strings.checkAlphanumeric(message)) {
            return;
        }

        // Specific user checks
        const shouldContinue: boolean = await this.specificRedeemChecks(message, this.triggerData.user);
        if (!shouldContinue) {
            return;
        }

        // Check if file exists
        const filename = "effects/vfx/videos/" + message + ".webm";
        const videoData = await this.videoExists(filename);

        // If it does not, exit
        if (videoData.exists === false) {
            const errorMessage: string = "Ain't no such video file: " + message;
            app.twitch.bot.say(errorMessage);
            return;
        }

        // If it does, attempt to add element to browser source and play it
        try {
            const videoElement: HTMLVideoElement = videoData.video;
            videoElement.setAttribute("id", "video-player");

            const vfxDiv: HTMLElement = document.getElementById("vfx-box");
            vfxDiv.appendChild(videoElement);
            videoElement.play();
            
            const removeDelay: number = 0;
            await Util.sleep(Util.Numbers.secToMS(videoElement.duration) + removeDelay);

            videoElement.pause();
            //videoElement.currentTime = 0;

            vfxDiv.removeChild(vfxDiv.firstChild);
        } catch(err) {
            Logger.error(err.toString());
        }
    }

    private async videoExists(filename: string): Promise<VideoExistenceData> {
        // Logger.noise(filename);
        return new Promise((resolve, reject) => {
            try {
                const videoToCheck = document.createElement("video");
                videoToCheck.src = filename;
                videoToCheck.oncanplaythrough = () => {
                    resolve({ exists: true, video: videoToCheck });
                };
                videoToCheck.onerror = () => {
                    resolve({ exists: false, video: null });
                };
            } catch(err) {
                Logger.noise("hi");
                Logger.error(err.toString());
            }
        });
    }

    private async specificRedeemChecks(message: string, user: string): Promise<boolean> {
        if (message === "disappear") {
            if (this.triggerData.user ==="Snackrodile") {
                const count: string = await Util.Vars.increment("snackHides");
                app.twitch.bot.say("Snack has hidden " + count + " times, for whatever reason. homerHide");
            } else {
                app.twitch.bot.say("Fuck you, pear, ya ain't even RIPE.");
            }
        } else if (message === "ronald") {
            app.twitch.bot.say("Use the Ronald button though.");
            return false;
        }
        return true;
    }
}