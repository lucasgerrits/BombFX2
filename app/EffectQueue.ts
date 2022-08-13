import { Effect } from './Effect.js';

export class EffectQueue {
    queue: Array<Effect>;
    delayInMS: number;
    isPaused: boolean;

    constructor(delayInSeconds: number = 5) {
        this.queue = new Array<Effect>();
        this.delayInMS = delayInSeconds * 1000;
        this.isPaused = false;
    }

    pause(): void {
        this.isPaused = true;
    }

    resume(): void {
        this.isPaused = false;
        if (this.queue.length > 0) {
            this.queue[0].run();
        }
    }

    push(effectIn: Effect): void {
        if (this.delayInMS < 0) {
            effectIn.run();
        } else {
            this.queue.push(effectIn);
            if (!this.isPaused && this.queue.length === 1) {
                this.queue[0].run();
            }
        }
    }

    next(): void {
        if (this.delayInMS < 0) {
            return;
        } else {
            this.queue.shift();
            if (!this.isPaused && this.queue.length > 0) {
                setTimeout(() => {
                    this.queue[0].run();
                }, this.delayInMS);
            }
        }
    }
};

export enum EffectQueueName {
    Barkeep = "barkeep",
    Camera = "camera",
    Crimbob = "crimbob",
    Jump = "jump",
    Main = "main",
    Media = "media",
    None = "none",
    Scene = "scene",
    Toads = "toads",
    Zora = "zora"
}