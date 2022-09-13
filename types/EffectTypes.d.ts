
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

export type PauseData = {
    game: string,
    action: string | (() => Promise<void>),
    duration?: number,
    chatText?: string
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