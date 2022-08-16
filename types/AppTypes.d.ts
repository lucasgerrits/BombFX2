import { EffectQueue } from "../app/EffectQueue.js";
import { Reward } from "../app/twitch/Reward.js";
import { UserLevel } from "../app/Enums.js";
import type { ChatEventData, CommandEventData } from "./ComfyTypes";
import type { TransitionBeginEvent } from "./OBSSocketTypes";

export type ChatTriggerData = {
    trigger: string,
    aliases?: string[],
    cooldown?: number,
    announceCD?: boolean,
    userLevel?: UserLevel,
    fetch?: boolean,
    action: string | ((data?: ChatEventData | CommandEventData) => Promise<void>)
}

export type EffectQueueBucket = {
    [key: string]: EffectQueue;
}

export type Greeting = {
    user: string,
    action: () => Promise<void>
}

export type RewardMapping = {
    key: string, value: Reward
}

export type SceneTransition = {
    scene: string,
    to: (data: TransitionBeginEvent) => Promise<void>,
    from: (data: TransitionBeginEvent) => Promise<void>
}

export type TimerData = {
    name: string,
    enabled: boolean,
    interval: number,
    action: () => Promise<void>
}