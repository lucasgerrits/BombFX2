import { BombFX } from '../BombFX.js';
import { Chatbot } from './Chatbot.js';
import { ChatHandler } from './ChatHandler.js';
import { Effect } from '../Effect.js';
import { Logger } from '../Logger.js';
import { modList } from '../../data/secrets/modlist.js';
import { Reward } from './Reward.js';
import { RewardMap } from './RewardMap.js';
import { RewardTriggerData } from '../EventTriggerData.js';
import { secrets } from '../../data/secrets/secrets.js';
import { Util } from '../util/Util.js';

declare var app: BombFX;
declare var ComfyJS: any;

export class Twitch {

    public bot: Chatbot;
    public chat: ChatHandler;
    public rewards: RewardMap;

    constructor() {
        ComfyJS.Init(secrets.channel, secrets.comfy.oauth);
        this.bot = new Chatbot();
        this.chat = new ChatHandler();
        this.rewards = new RewardMap();
    }

    public checkRedemption(data: RewardTriggerData): void {
        let id = data.rewardID;
        if (this.rewards.has(id)) {
            let logStr: string = data.user + " redeemed " + data.reward + " for " + data.cost + " PP.";
            if (data.message !== "") { logStr += "(" + data.message + ")" }
            Logger.twitch(logStr);
            this.queueReward(data);
        } else { 
            Logger.twitch("Unhandled Reward ID: " + id);
        }
    }

    private queueReward(data: RewardTriggerData): void {
        let reward: Reward = this.rewards.get(data.rewardID);
        let effect: Effect = reward.effect;
        effect.setTriggerData(data);
        app.queues[effect.queueType].push(effect);
    }

    public static async createNewReward(): Promise<void> {
        await ComfyJS.CreateChannelReward(secrets.comfy.clientID, {
            title: "Newly Created Reward",
            prompt: "Because Twitch rules are silly",
            cost: 9999999,
            is_enabled: true,
            background_color: "#000000",
            is_user_input_required: false,
            is_max_per_stream_enabled: false,
            max_per_stream: 0,
            is_max_per_user_per_stream_enabled: false,
            max_per_user_per_stream: 0,
            is_global_cooldown_enabled: false,
            global_cooldown_seconds: 0,
            should_redemptions_skip_request_queue: false
        });
        Logger.twitch("New reward created.");
    }

    public async chatList(): Promise<any> {
        let url: string = "https://tmi.twitch.tv/group/user/carefreebomb/chatters";
        let request = await Util.Requests.makeRequest(url);
        let json: string = request.response;
        let obj: any = JSON.parse(json).chatters;
        let chatters: Array<string> = obj.broadcaster.concat(obj.moderators, obj.vips,
            obj.viewers, obj.staff, obj.admins, obj.global_mods);
        console.log(chatters);
    }

    public isMod(username: string): boolean {
        return modList.some(mod => username.toLowerCase() === mod);
    };

    public async profilePic(user: string, size: number = 300): Promise<any> {
        let url: string = "https://www.carefreebomb.com/twitchapi/profilepic.php?user=" +
            user + "&size=" + size;
        let result = await Util.Requests.makeRequest(url);
        return result.response;
    };
}