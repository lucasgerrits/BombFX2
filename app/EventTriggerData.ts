import type { ChatEventData, RewardEventData } from "../types/ComfyTypes";

export class EventTriggerData {
    public user: string;
    public message: string;
    public timestamp: string;

    constructor(userIn: string, messageIn: string, timestampIn: string) {
        this.user = userIn;
        this.message = messageIn;
        this.timestamp = timestampIn;
    }
}

export class RewardTriggerData extends EventTriggerData {
    public reward: string;
    public cost: number;
    public rewardID: string;

    constructor(data: RewardEventData) {
        super(data.user, data.message, data.extra.timestamp);
        this.reward = data.reward;
        this.cost = data.cost;
        this.rewardID = data.extra.reward.id;
    }
}

export class ChatEventTriggerData extends EventTriggerData {
    public messageID: string;

    constructor(data: ChatEventData) {
        super(data.user, data.message, data.extra.timestamp);
        this.messageID = data.extra.id;
    }
}