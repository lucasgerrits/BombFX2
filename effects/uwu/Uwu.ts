import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class UwuReward extends Reward {
    public static override id: string = "3ed1deb2-c645-4b24-a427-f184ec63d25c";
    public static override title: string = "uwu";
    public static override cost: number = 800;

    constructor() {
        super(UwuReward.id, UwuReward.title, new Uwu());
    }
}

export class Uwu extends Effect {
    constructor() {
        super(EffectQueueName.None);
    }
    
    public override async start(): Promise<void> {
        const url: string = "https://uwuaas.herokuapp.com/api/";
        const body = { text: this.triggerData.message };
        const json = JSON.stringify(body);
        const result: any = await Util.Requests.makeRequest(url, "POST", json);
        const obj: any = JSON.parse(result.response);
        const msg: string = obj.text;
        app.twitch.bot.say(msg);
        app.tts.say(msg, "Ivy");
    }
}