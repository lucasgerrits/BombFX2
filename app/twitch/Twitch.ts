import { BombFX } from "../BombFX.js";
import { Chatbot } from "./Chatbot.js";
import { ChatHandler } from "./ChatHandler.js";
import { Effect } from "../Effect.js";
import { Logger } from "../Logger.js";
import { modList } from "../../data/secrets/modlist.js";
import { Reward } from "./Reward.js";
import { RewardMap } from "./RewardMap.js";
import { RewardTriggerData } from "../EventTriggerData.js";
import { secrets } from "../../data/secrets/secrets.js";
import { Util } from "../util/Util.js";

/* eslint-disable no-var */
declare var app: BombFX;
declare var ComfyJS: any;
/* eslint-enable no-var */

/**
 * @class - Containing object for all Twitch related functions, API calls, chat and reward handlers.
 * 
 * @property bot {Chatbot}          - The object handling all of the IRC messages sent from the Twitch bot account
 * @property chat {ChatHandler}     - Handles parsing of chat messages for commands and triggers
 * @property rewards {RewardMap}    - HashMap containing reward ID keys and associated reward / effect data values
 */
export class Twitch {

    public bot: Chatbot;
    public chat: ChatHandler;
    public rewards: RewardMap;
    public lastRedeemedID: string;

    /**
     * Initializes class properties and establishes connection to chat and Twitch websocket through ComfyJS
     * @constructor
     */
    constructor() {
        ComfyJS.Init(secrets.channel, secrets.comfy.oauth);
        this.bot = new Chatbot();
        this.bot.connect();
        this.chat = new ChatHandler();
        this.rewards = new RewardMap();
    }
    
    /**
     * Checks if the provided Twitch reward ID is present in the HashMap of available redeems.
     * 
     * @param data {RewardTriggerData} A object containing all relevant information to the Twtich channel point reward event
     * including username, reward ID, cost, optional message, etc.
     */
    public checkRedemption(data: RewardTriggerData): void {
        const id = data.rewardID;
        if (this.rewards.has(id)) {
            let logStr: string = data.user + " redeemed " + data.reward + " for " + data.cost + " PP.";
            if (data.message !== "") { logStr += "(" + data.message + ")"; }
            Logger.twitch(logStr);
            this.queueReward(data);
        } else {
            Logger.twitch("Unhandled Reward ID: " + id);
        }
    }

    /**
     * Creates a reward object based on the event data and queues it in the appropriate place.
     * 
     * @param data {RewardTriggerData} A object containing all relevant information to the Twtich channel point reward event
     * including username, reward ID, cost, optional message, etc.
     */
    private queueReward(data: RewardTriggerData): void {
        const reward: Reward = this.rewards.get(data.rewardID);
        const effect: Effect = reward.effect;
        effect.setTriggerData(data);
        app.queues[effect.queueType].push(effect);
    }

    /**
     * Makes a Twitch Helix API call through ComfyJS to create a new channel point reward.
     */
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

    /**
     * Outputs a list of the current chatters to the remote debugging console.
     */
    public async chatList(): Promise<any> {
        const url: string = "https://tmi.twitch.tv/group/user/carefreebomb/chatters";
        const request = await Util.Requests.makeRequest(url);
        const json: string = request.response;
        const obj: any = JSON.parse(json).chatters;
        const chatters: Array<string> = obj.broadcaster.concat(obj.moderators, obj.vips,
            obj.viewers, obj.staff, obj.admins, obj.global_mods);
        console.log(chatters);
    }

    /**
     * Determines whether a particular user is present on the list of moderators.
     * 
     * @param username {string} The user to be checked for mod status
     * @returns {boolean} True if user moderator, else false
     */
    public isMod(username: string): boolean {
        return modList.some(mod => username.toLowerCase() === mod);
    }

    /**
     * Makes a call to Twitch API to retrieve the URL of a given user's profile picture
     * 
     * @param user {string} The given user to retrieve the profile picture for
     * @param size {number} The dimension of the sides of the profile picture
     * @returns {string} The url of the specified user's profile picture at the optionally specified resolution
     */
    public async profilePic(user: string, size: number = 300): Promise<any> {
        const url: string = "https://www.carefreebomb.com/twitchapi/profilepic.php?user=" +
            user + "&size=" + size;
        const result = await Util.Requests.makeRequest(url);
        return result.response;
    }
}