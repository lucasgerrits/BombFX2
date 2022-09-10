import { BombFX } from "./BombFX.js";
import { Logger } from "./Logger.js";
import { timers } from "../data/timers.js";
import { Util } from "./util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class Timer {
    private delay: number;
    private interval: number;
    private fn: () => unknown;

    constructor(delayIn: number, fnIn: () => unknown) {
        this.delay = delayIn;
        this.fn = fnIn;
        this.interval = setInterval(this.fn, this.delay);
    }
}

export class ChatTimer extends Timer {
    constructor(delayIn: number, strIn: string) {
        const arr: any = [ strIn ];
        const fn: () => unknown = Util.wrapFn(null, (strIn: string) => {
            app.twitch.bot.say(strIn);
        }, arr);
        super(delayIn, fn);
    }
}

export class TimerMap {
    private enabled: boolean = true;
    private map: Map<string, Timer>;

    constructor() {
        if (this.enabled === false) {
            Logger.bomb("Timers disabled");
            return;
        }
        this.map = new Map<string, Timer>();
        this.setTimers();
    }

    private setTimers(): void {
        timers.forEach((t) => {
            if (t.isEnabled) {
                this.map.set(t.name, new Timer(t.interval, t.action));
            }
        });
    }
}