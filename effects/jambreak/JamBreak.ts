import { BombFX } from "../../app/BombFX.js";
import { jambreaks } from "./breaks.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { PauseReward } from "../pause/Pause.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import type { JamBreakData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class JamBreakReward extends Reward {
    public static override id: string = "a4530cb6-e570-4841-9ef3-b8dd7ffba545";
    public static override title: string = "Jamm_ Break";
    public static override cost: number = 2000;

    constructor() {
        super(JamBreakReward.id, JamBreakReward.title, new JamBreak());
    }
}

export class JamBreak extends Effect {
    private breakNumber: number = -1;

    constructor(breakNumber?: number) {
        super(EffectQueueName.Scene);
        if (breakNumber != null) {
            this.breakNumber = breakNumber;
        }
    }
    
    public override async setup(): Promise<void> {
        PauseReward.pause();
    }

    public override async dismantle(): Promise<void> {
        PauseReward.resume();
    }

    public override async start(): Promise<void> {
        const jamBreakScene: string = "Jam Break";

        // Determine which jamm_
        let chance: number = this.breakNumber - 1; // human numbers in chat, zero indexing in code
        if (this.breakNumber == -1) {
            chance = Util.Numbers.getRandomIntegerInclusive(0, jambreaks.length - 1);
        }
        const jam: JamBreakData = jambreaks[chance];

        // Relevant chatbot messages
        const botMsg: string = `Jamm_ Break #${chance + 1} of ${jambreaks.length}: ${jam.name}`;
        app.twitch.bot.say(botMsg);
        if (jam.chatText!) {
            app.twitch.bot.say(jam.chatText);
        }

        // If action is a string, jam requires a single source
        if (typeof jam.action === "string") {
            // Show relevant media file / browser source
            app.obs.showSourceForDuration(jam.action, jamBreakScene, jam.duration);
            await Util.sleep(jam.duration);
        } else {
            // Otherwise it requires multiple steps (filters, etc)
            await jam.action();
        }

        await Util.sleep(1500);
    }
}