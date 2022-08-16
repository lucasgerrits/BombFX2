import { BombFX } from './BombFX.js';
import { Logger } from './Logger.js';
import { timers } from '../data/timers.js';
import { Util } from "./Util.js";

declare var app: BombFX;

export class Timer {
    private delay: number;
    private interval: number;
    private fn: Function;

    constructor(delayIn: number, fnIn: Function) {
        this.delay = delayIn;
        this.fn = fnIn;
        this.interval = setInterval(this.fn, this.delay);
    }
}

export class ChatTimer extends Timer {
    constructor(delayIn: number, strIn: string) {
        let fn: Function = Util.wrapFn(null, (strIn: string) => {
            app.twitch.bot.say(strIn)
        }, new Array<string>(strIn));
        super(delayIn, fn);
    }
}

export class TimerMap {
    private enabled: boolean = true;
    private map: Map<string, Timer>

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
            this.map.set(t.name, new Timer(t.interval, t.action));
        });
    }
}