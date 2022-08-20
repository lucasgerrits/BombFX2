
// EVENTS

export type SourceMuteStateChangedEvent = {
    sourceName: string;
    muted: boolean;
}

type TransitionBeginEvent = {
    name?: string;
    type?: string;
    duration?: number;
    fromScene: string;
    toScene: string;
}

// REQUESTS

export type TakeSourceScreenshotRequest = {
    sourceName?: string,
    embedPictureFormat?: string,
    saveToFilePath: string,
    fileFormat?: string,
    compressionQuality?: number,
    width?: number,
    height?: number
}

export type TakeSourceScreenshotResponse = {
    sourceName: string,
    img: string,
    imageFile: string
}