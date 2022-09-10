import { EffectQueue } from "../app/EffectQueue.js";
import { Reward } from "../app/twitch/Reward.js";
import { UserLevel } from "../app/Enums.js";
import type { ChatEventData, CommandEventData } from "./ComfyTypes.js";

export type ChatTriggerData = {
    trigger: string,
    aliases?: string[],
    cooldown?: number,
    announceCD?: boolean,
    announcePrivs?: boolean,
    userLevel?: UserLevel,
    permittedUsers?: string[],
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
    to: (data: TransitionScenes) => Promise<void>,
    from: (data: TransitionScenes) => Promise<void>
}

export type TransitionScenes = {
    fromScene: string,
    toScene: string
}

export type TimerData = {
    name: string,
    isEnabled: boolean,
    interval: number,
    action: () => Promise<void>
}