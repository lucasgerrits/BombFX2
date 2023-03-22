import { ISubsAndDubsVoice } from "../effects/subsanddubs/ISubsAndDubsVoice.js";
import { SubsAndDubsVoice } from "../effects/subsanddubs/SubsAndDubsVoice.js";

export type CowLaunchData = {
    user_name: string,
    launches: string,
    rank: string,
    most_recent: string,
    total_users: string,
    total_launches: string
}

export type JamBreakData = {
    name: string,
    action: string | (() => Promise<void>),
    duration?: number,
    chatText?: string
}

export type PauseTypeData = {
    game?: string,
    action: string | ((data?: PauseEventData) => Promise<void>),
    duration?: number,
    chatText?: string
}

export type PauseEventData = {
    scene: string,
    filter: string
}

export type SoundExistenceData = {
    exists: boolean;
    audio: HTMLAudioElement;
}

export type VideoExistenceData = {
    video: HTMLVideoElement;
} & SourceExistenceData

export type SourceExistenceData = {
    filename?: string;
    exists: boolean;
}

export type SubsAndDubsData = {
    [name: string]: SubsAndDubsVoiceData;
}

export type SubsAndDubsVoiceData = {
    duration: number;
    effect: ISubsAndDubsVoice & SubsAndDubsVoice;
}