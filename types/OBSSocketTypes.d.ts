
// EVENTS

export type SourceMuteStateChangedEvent = {
    sourceName: string;
    muted: boolean;
}

type TransitionBeginEvent = {
    duration: number;
    fromScene: string;
    name: string;
    toScene: string;
    type: string;
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