
export type StreamerBotTriggerData = {
    name: string,
    action: (data?: any) => Promise<void>
}