import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { pauses } from "./pauses.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import type { PauseTypeData, PauseEventData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class PauseReward extends Reward {
    public static override id: string = "0e7ab4e5-9df3-48e1-b7fd-18203623b712";
    public static override title: string = "Pause";
    public static override cost: number = 300;

    constructor() {
        super(PauseReward.id, PauseReward.title, new Pause());
    }
}

export class Pause extends Effect {
    public static scene: string = "Pauses";
    private pauseNumber: number = -1;

    constructor(pauseNumber?: number) {
        super(EffectQueueName.Pause);
        if (pauseNumber != null) {
            this.pauseNumber = pauseNumber;
        }
    }
    
    public override async start(): Promise<void> {
        const filterName: string = "Pause Redeem Freeze";

        // Get pause type from user input
        const pauseKey: string = this.cleanTriggerText(this.triggerData.message);

        // Determine if pause list even contains the passed in pause name
        if (!Object.prototype.hasOwnProperty.call(pauses, pauseKey)) {
            app.twitch.bot.say("Hey dingdong, ya done goofed");
            return;
        }

        const pause: PauseTypeData = pauses[pauseKey];

        // Determines if the bot needs to say hi to fox lol
        this.foxCheck(pauseKey);

        // Get current scene
        const currentScene: string = await app.obs.getCurrentSceneName();

        // If action is a string, pause requires a single source
        if (typeof pause.action === "string") {
            // Apply freeze filter to it
            await app.obs.call("CreateSourceFilter", {
                "sourceName" : currentScene,
                "filterName" : filterName,
                "filterKind" : "freeze_filter",
                "filterSettings" : { "refresh_interval": 0 }
            });

            // Give OBS and socket some buffer time to add filter
            await Util.sleep(50);

            // Create screenshot from frozen scene
            const imageFilePath = "C:\\xampp\\htdocs\\fx2\\effects\\pause\\freezeframe.png";
            await app.obs.saveSourceScreenshot(currentScene, imageFilePath);

            // Show paused scene screenshot
            await app.obs.showSource("Paused Scene Screenshot", "** Mega Overlay");

            // Show relevant media file / browser source
            app.obs.showSourceForDuration(pause.action, Pause.scene, pause.duration);

            // Mute mic and output before specific pause instructions
            await app.obs.muteMic();
            await app.obs.muteDesktop();

            // Remove freeze filter from current scene
            app.obs.call("RemoveSourceFilter", {
                sourceName : currentScene,
                filterName : filterName
            });

            await Util.sleep(pause.duration);
        } else {
            // Otherwise it requires multiple steps (filters, etc)
            const data: PauseEventData = { scene: currentScene, filter: filterName };
            await pause.action(data);
        }

        // Hide paused scene screenshot
        await app.obs.hideSource("Paused Scene Screenshot", "** Mega Overlay");

        // Unmute mic and output
        await app.obs.unmuteMic();
        await app.obs.unmuteDesktop();
        await Util.sleep(500);
    }

    private async foxCheck(pauseKey: string): Promise<void> {
        if (this.triggerData.user === "FoxiFries" && pauseKey === "toads") {
            app.twitch.bot.say("hi fox, ");
        }
    }
}