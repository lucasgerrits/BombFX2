
export type TriggerEventData = 
    ChatEventData | CommandEventData | RewardEventData;

// CHAT

export type ChatEventData = {
    user: string;
    message: string;
    flags: ChatFlags;
    self?: boolean;
    extra: ChatExtra;
}

export type ChatFlags = {
    broadcaster: boolean;
    customReward: boolean;
    founder: boolean;
    highlighted: boolean;
    mod: boolean;
    subscriber: boolean;
    vip: boolean;
}

export type ChatExtra = {
    id: string;
    isEmoteOnly: boolean;
    timestamp: string;
    userColor: string;
    userId: string;
}

// COMMANDS

export type CommandEventData = {
    command: string;
} & ChatEventData

export type CommandExtra = {
    sinceLastCommand: {
        any: number;
        user: number;
    };
} & ChatExtra

// CHEERS / BITS

export type CheerEventData = {
    bits: number;
} & ChatEventData

// POINT REWARDS

export type RewardEventData = {
    user: string;
    reward: string;
    cost: number;
    message: string;
    extra: RewardExtra;
}

export type RewardExtra = {
    customRewardId: string;
    reward: { id: string; };
    rewardFulfilled: boolean;
    timestamp: string;
}

export type RewardSettings = {
    title?: string,
    prompt?: string,
    cost?: number,
    is_enabled?: boolean,
    is_paused?: boolean,
    background_color?: string,
    is_user_input_required?: boolean,
    is_max_per_stream_enabled?: boolean,
    max_per_stream?: number,
    is_max_per_user_per_stream_enabled?: boolean,
    max_per_user_per_stream?: number,
    is_global_cooldown_enabled?: boolean,
    global_cooldown_seconds?: number,
    should_redemptions_skip_request_queue?: boolean
}