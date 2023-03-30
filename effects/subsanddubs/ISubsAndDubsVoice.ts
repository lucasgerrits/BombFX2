
export interface ISubsAndDubsVoice {
    start(): Promise<void>
    stop(): Promise<void>
    displayText(text: string): Promise<void>
    updateTimer(): Promise<void>
}