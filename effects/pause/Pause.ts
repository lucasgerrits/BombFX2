import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { pauses } from "./pauses.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import type { PauseData } from "../../types/EffectTypes.js";

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
        super(EffectQueueName.None);
        if (pauseNumber != null) {
            this.pauseNumber = pauseNumber;
        }
    }
    
    public override async start(): Promise<void> {
        // Determine which pause
        let chance: number = this.pauseNumber - 1; // human numbers in chat, zero indexing in code
        if (this.pauseNumber == -1) {
            chance = Util.Numbers.getRandomIntegerInclusive(0, pauses.length - 1);
        }
        const pause: PauseData = pauses[chance];

        // Relevant chatbot messages
        const botMsg: string = `Pause #${chance + 1} of ${pauses.length}: ${pause.game}`;
        app.twitch.bot.say(botMsg);
        if (pause.chatText!) {
            app.twitch.bot.say(pause.chatText);
        }

        await this.foxCheck(chance);

        // Mute mic and output before specific pause instructions
        await app.obs.muteMic();
        await app.obs.muteDesktop();
        await Util.sleep(200);

        // Get current scene and apply freeze filter to it
        const currentScene: string = await app.obs.getCurrentSceneName();
        app.obs.call("CreateSourceFilter", {
            "sourceName" : currentScene,
            "filterName" : "Pause Redeem Freeze",
            "filterKind" : "freeze_filter",
            "filterSettings" : { "refresh_interval": 0 }
        });

        // Begin specific Pause instructions

        // If action is a string, jam requires a single source
        if (typeof pause.action === "string") {
            // Show relevant media file / browser source
            app.obs.showSourceForDuration(pause.action, Pause.scene, pause.duration);
            await Util.sleep(pause.duration);
        } else {
            // Otherwise it requires multiple steps (filters, etc)
            await pause.action();
        }

        // Remove freeze filter from current scene
        app.obs.call("RemoveSourceFilter", {
            sourceName : currentScene,
            filterName : "Pause Redeem Freeze"
        });

        // Unmute mic and output
        app.obs.unmuteMic();
        app.obs.unmuteDesktop();

    }

    private async foxCheck(pauseNumber: number): Promise<void> {
        if (this.triggerData.user === "FoxiFries" && pauseNumber === 0) {
            app.twitch.bot.say("hi fox, ");
        }
    }
}