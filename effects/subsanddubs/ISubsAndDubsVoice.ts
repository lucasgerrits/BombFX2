
export interface ISubsAndDubsVoice {
    start(): Promise<void>
    stop(): Promise<void>
    displayText(): Promise<void>
}