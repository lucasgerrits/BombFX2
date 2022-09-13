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
    public static override title: string = "Press Start";
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

        // Determine which pause
        let chance: number = this.pauseNumber - 1; // human numbers in chat, zero indexing in code
        if (this.pauseNumber == -1) {
            chance = Util.Numbers.getRandomIntegerInclusive(0, pauses.length - 1);
        }
        const pause: PauseTypeData = pauses[chance];

        // Relevant chatbot messages
        const botMsg: string = `Pause #${chance + 1} of ${pauses.length}: ${pause.game}`;
        app.twitch.bot.say(botMsg);
        if (pause.chatText!) {
            app.twitch.bot.say(pause.chatText);
        }

        // Determines if the bot needs to say hi to fox lol
        this.foxCheck(chance);

        // Get current scene and apply freeze filter to it, but immediately hidden
        const currentScene: string = await app.obs.getCurrentSceneName();
        await app.obs.call("CreateSourceFilter", {
            "sourceName" : currentScene,
            "filterName" : filterName,
            "filterKind" : "freeze_filter",
            "filterSettings" : { "refresh_interval": 0 }
        });
        await app.obs.hideFilter(currentScene, filterName);

        // If action is a string, jam requires a single source
        if (typeof pause.action === "string") {
            // Mute mic and output before specific pause instructions
            await app.obs.muteMic();
            await app.obs.muteDesktop();
            await Util.sleep(200);

            await app.obs.showFilter(currentScene, filterName);

            // Show relevant media file / browser source
            app.obs.showSourceForDuration(pause.action, Pause.scene, pause.duration);
            await Util.sleep(pause.duration);
        } else {
            // Otherwise it requires multiple steps (filters, etc)
            const data: PauseEventData = { scene: currentScene, filter: filterName };
            await pause.action(data);
        }

        // Remove freeze filter from current scene
        await app.obs.call("RemoveSourceFilter", {
            sourceName : currentScene,
            filterName : filterName
        });

        // Unmute mic and output
        await app.obs.unmuteMic();
        await app.obs.unmuteDesktop();
        await Util.sleep(500);
    }

    private async foxCheck(pauseNumber: number): Promise<void> {
        if (this.triggerData.user === "FoxiFries" && pauseNumber === 0) {
            app.twitch.bot.say("hi fox, ");
        }
    }
}