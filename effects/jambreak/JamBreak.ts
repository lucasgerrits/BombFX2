import { BombFX } from "../../app/BombFX.js";
import { jamBreaks } from "./breaks.js";
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
    private jamProps: Array<string>;

    constructor(breakNumber?: number) {
        super(EffectQueueName.Scene);
        if (breakNumber != null) {
            this.breakNumber = breakNumber;
        }
        this.jamProps = Object.keys(jamBreaks);
    }
    
    public override async setup(): Promise<void> {
        PauseReward.pause();
    }

    public override async dismantle(): Promise<void> {
        PauseReward.resume();
    }

    public override async start(): Promise<void> {
        const jamBreakScene: string = "Jam Break";

        // Get specified jam break trigger from user input string
        const inputJam: string = this.cleanTriggerText(this.triggerData.message);

        // Get random input jam data
        if (inputJam === "random") {
            this.breakNumber = Util.Numbers.getRandomIntegerInclusive(0, this.jamProps.length - 1);
        } // Otherwise, determine if jam list contains user input jam 
        else if (!Object.prototype.hasOwnProperty.call(jamBreaks, inputJam)) {
            // If it doesn't, shame chatter and end
            app.twitch.bot.say("Hey dingdong, ya done goofed");
            return;
        }
        else {
            this.breakNumber = this.jamProps.indexOf(inputJam);
        }

        const jam: JamBreakData = jamBreaks[this.jamProps[this.breakNumber]];

        // Relevant chatbot messages
        const botMsg: string = `Jamm_ Break #${this.breakNumber + 1} of ${this.jamProps.length}: ${jam.name}`;
        app.twitch.bot.say(botMsg);
        if (jam.chatText!) {
            app.twitch.bot.say(jam.chatText);
        }

        // If action is a string, jam requires a single OBS source
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