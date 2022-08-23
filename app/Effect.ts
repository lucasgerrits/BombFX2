import { BombFX } from "./BombFX.js";
import { EffectQueueName } from "./EffectQueue.js";
import { EventTriggerData } from "./EventTriggerData.js";
import { Logger } from "./Logger.js";
import { Util } from "./util/Util.js";

/* eslint-disable no-var */
declare var app: BombFX;
declare var window: any;
/* eslint-enable no-var */

export class Effect {

    public durationInSeconds: number;
    public queueType: string;
    public triggerData!: EventTriggerData;
    public stopOverride: boolean;
    private listener: () => void = null;

    constructor(queueTypeIn: EffectQueueName, stopOverrideIn: boolean = false) {
        this.queueType = queueTypeIn;
        this.stopOverride = stopOverrideIn;
    }

    public async run(): Promise<void> {
        if (this.queueType !== EffectQueueName.None) {
            Logger.bomb(this.constructor.name + " Began");
        }
        if (this.stopOverride === true) {
            this.addStopListener();
        }
        await this.setup();
        await this.start();
        if (this.stopOverride === false) {
            this.stop(); // The Strokes - Automatic Stop
        }
    }

    public async start(): Promise<void> {
        Logger.error("No start() method override set for " + (typeof this));
    }

    protected async stop(): Promise<void> {
        await this.dismantle();
        if (this.stopOverride === true) {
            this.removeStopListener();
        }
        if (this.queueType !== EffectQueueName.None) {
            Logger.bomb(this.constructor.name + " Ended");
        }
        app.tts.speaker.onended = null;
        this.next();
    }

    private async addStopListener(): Promise<void> {
        Logger.noise("Adding stopListener()");
        this.listener = () => { this.stop(); };
        window.addEventListener("EffectStop", this.listener);
        await Util.sleep(3000);
    }

    private removeStopListener(): void {
        Logger.noise("Removing stopListener()");
        window.removeEventListener("EffectStop", this.listener);
        this.listener = null;
    }

    protected emitStop(): void {
        Logger.noise("emitStop()");
        const evt = new CustomEvent("EffectStop", { bubbles: true, detail: "Hi, github" });
        window.dispatchEvent(evt);
    }

    public async next(): Promise<void> {
        if (this.queueType !== EffectQueueName.None) {
            app.queues[this.queueType].next();
        }
    }

    public setTriggerData(dataIn: EventTriggerData) {
        this.triggerData = dataIn;
    }

    public async setup(): Promise<void> { Util.sleep(1); }

    public async dismantle(): Promise<void> { Util.sleep(1); }
}