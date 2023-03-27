import { ISubsAndDubsVoice } from "../../ISubsAndDubsVoice.js";
import { SubsAndDubs } from "../../SubsAndDubs.js";
import { SubsAndDubsVoice } from "../../SubsAndDubsVoice.js";

export class NookVoice extends SubsAndDubsVoice implements ISubsAndDubsVoice {
    async start(): Promise<void> {
        // Show boxes on screen
        console.log("hello");
    }

    async stop(): Promise<void> {
        // Hide boxes on screen
        console.log("goodbye");
    }

    async displayText(): Promise<void> {
        // This is the logic for adding characters and stuff to said boxes
    }
}