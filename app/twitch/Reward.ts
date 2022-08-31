import { Effect } from "../Effect.js";
import { Logger } from "../Logger.js";
import { secrets } from "../../data/secrets/secrets.js";
import type { RewardSettings } from "../../types/ComfyTypes.js";

// eslint-disable-next-line no-var
declare var ComfyJS: any;

export abstract class Reward {
    
    public static id: string = "test";
    public static title: string = "Fix ur code idiot lol";
    public static buttonColor: string = "#000000";
    public static cost: number = 9999999;
    
    public id: string;
    public title: string;
    public buttonColor: string;
    public cost: number;

    public allowedOnBRB: boolean = false;

    public effect: Effect;

    public creator: Pick<typeof Reward, keyof typeof Reward>;

    constructor(idIn: string, titleIn: string, effectIn: Effect, buttonColorIn: string = Reward.buttonColor) {
        this.id = idIn;
        this.title = titleIn;
        this.buttonColor = buttonColorIn;
        this.allowedOnBRB;
        this.effect = effectIn;
    }

    // PAUSE

    public async pause(newTitle: string = this.title + " (Paused)"): Promise<void> {
        await Reward.pauseReward(this.id, newTitle);
    }

    public static async pause(newTitle: string = this.title + " (Paused)"): Promise<void> {
        await Reward.pauseReward(this.id, newTitle);
    }

    private static async pauseReward(idIn: string, newTitle: string): Promise<void> {
        // Logger.twitch("Pausing " + newTitle); // + " - (" + idIn + ")"
        // todo: stop effect queue
        await ComfyJS.UpdateChannelReward(secrets.comfy.clientID, idIn, {
            title: newTitle,
            is_paused: true,
            background_color: "#101012"
        });
    }

    // RESUME

    public async resume(): Promise<void> {
        Reward.resumeReward(this.id, this.title, this.buttonColor);
    }

    public static async resume(): Promise<void> {
        Reward.resumeReward(this.id, this.title, this.buttonColor);
    }

    private static async resumeReward(idIn: string, newTitle: string, buttonColor: string): Promise<void> {
        // Logger.twitch("Resuming " + newTitle); // + " - (" + idIn + ")"
        // todo: resume effect queue
        await ComfyJS.UpdateChannelReward(secrets.comfy.clientID, idIn, {
            title: newTitle,
            is_paused: false,
            background_color: buttonColor
        });
    }

    // ENABLE

    public async enable(): Promise<void> {
        Reward.enableReward(this.id);
    }

    public static async enable(): Promise<void> {
        Reward.enableReward(this.id);
    }

    private static async enableReward(idIn: string): Promise<void> {
        Logger.twitch("Enabling " + this.title);
        await ComfyJS.UpdateChannelReward(secrets.comfy.clientID, idIn, {
            is_enabled: true,
        });
    }

    // DISABLE

    public async disable(): Promise<void> {
        Reward.disableReward(this.id);
    }

    public static async disable(): Promise<void> {
        Reward.disableReward(this.id);
    }

    private static async disableReward(idIn: string): Promise<void> {
        Logger.twitch("Disabling " + this.title);
        await ComfyJS.UpdateChannelReward(secrets.comfy.clientID, idIn, {
            is_enabled: false,
        });
    }

    // SET COST

    public async setCost(newCost: number, newTitle: string = this.title): Promise<void> {
        Reward.setRewardCost(this.id, newCost, newTitle);
    }

    public static async setCost(newCost: number, newTitle: string = this.title): Promise<void> {
        Reward.setRewardCost(this.id, newCost, newTitle);
    }

    private static async setRewardCost(idIn: string, newCost: number, newTitle: string): Promise<void> {
        Logger.twitch("Setting new cost of " + this.title + ": " + newCost);
        await ComfyJS.UpdateChannelReward(secrets.comfy.clientID, idIn, {
            cost: newCost
        });
    }

    // UPDATE MULTIPLE SETTINGS

    public async update(settings: RewardSettings): Promise<void> {
        Reward.updateReward(this.id, settings);
    }

    public static async update(settings: RewardSettings): Promise<void> {
        Reward.updateReward(this.id, settings);
    }

    public static async updateReward(idIn: string, settings: RewardSettings): Promise<void> {
        Logger.twitch("Updating multiple settings of " + this.title);
        await ComfyJS.UpdateChannelReward(secrets.comfy.clientID, idIn, settings);
    }

    // RESET TO DEFAULTS

    public async reset(): Promise<void> {
        const settings: RewardSettings = {
            "title": this.title,
            "cost": this.cost,
            "background_color": this.buttonColor,
            "is_paused": false
        };
        Reward.resetReward(this.id, settings);
    }

    public static async reset(): Promise<void> {
        const settings: RewardSettings = {
            "title": this.title,
            "cost": this.cost,
            "background_color": this.buttonColor,
            "is_paused": false
        };
        Reward.resetReward(this.id, settings);
    }

    public static async resetReward(idIn: string, settings: RewardSettings): Promise<void> {
        await ComfyJS.UpdateChannelReward(secrets.comfy.clientID, idIn, settings);
    }
}