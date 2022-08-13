import { BombFX } from './BombFX.js';
import { Kona } from '../effects/kona/Kona.js';
import { Logger } from './Logger.js';
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
    private enabled: boolean = false;
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
        this.map.set("kona", new Timer(
            Kona.determineInterval(),
            () => {
                Kona.wave();
            }
        ));
        this.map.set("dice", new Timer(
            Util.Time.minToMS(60),
            () => {
                let diceStr: string = "/announce To meet the best " + 
                    "followers, viewers, primes, and streamer, tune in " + 
                    "to twitch .tv/Dice_The_Vice (remove the space)";
                app.twitch.bot.say(diceStr, true);
            }
        ));
    }
}