
// EVENTS

export type InputMuteStateChangedEvent = {
    inputName: string,
    inputMuted: boolean
}

export type CurrentProgramSceneChangedEvent = {
    sceneName: string
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