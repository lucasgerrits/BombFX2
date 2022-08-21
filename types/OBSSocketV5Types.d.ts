
// EVENTS

export type CurrentProgramSceneChangedEvent = {
    sceneName: string
}

export type InputMuteStateChangedEvent = {
    inputName: string,
    inputMuted: boolean
}

export type StreamStateChangedEvent = {
    outputActive: boolean;
    outputState: string;
}

// REQUEST RESPONSES

export type GetSceneItemIdResponse = {
    sceneItemId: number
}

export type GetInputSettingsResponse = {
    inputSettings: object,
    inputKind: string
}

export type SaveSourceScreenshotResponse = {
    imageData: string
}