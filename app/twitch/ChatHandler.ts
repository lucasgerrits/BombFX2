import { Bits } from '../../effects/bits/Bits.js';
import { BombFX } from '../BombFX.js';
import { ChatTrigger } from './ChatTrigger.js';
import { DonutBreak } from '../../effects/donut/Donut.js';
import { GreetingMap } from './GreetingMap.js';
import { Logger } from '../Logger.js';
import { secrets } from '../../data/secrets.js';
import { TriggerMap } from './TriggerMap.js';
import { Util } from '../Util.js';
import type { ChatEventData, CheerEventData, CommandEventData } from '../../types/ComfyTypes.js';

declare var app: BombFX;
declare var ComfyJS: any;

export class ChatHandler {

    private greetingsEnabled = false;

    private usersWhoHaveTalked: Set<string>;
    private greetings: GreetingMap;
    public triggers: TriggerMap;

    constructor() {
        this.triggers = new TriggerMap();
        this.usersWhoHaveTalked = new Set<string>();
        this.greetings = new GreetingMap();
    }

    public async say(msg: string): Promise<void> {
        ComfyJS.Say(msg);
    }

    public async deleteMessage(id: string): Promise<void> {
        ComfyJS.GetClient().deletemessage(secrets.channel, id);
    }

    public handler(data: ChatEventData) {
        this.firstFromUserCheck(data.user);
        this.actuallyFirstCheck(data.user, data.message);
        this.checkTriggers(data);
        DonutBreak.handler(data.user, data.message, data.extra.id);
    }

    private firstFromUserCheck(user: string) {
        if (user === "CareFreeBomb") { return; }

        if (!this.usersWhoHaveTalked.has(user)) {
            Logger.twitch("Adding " + user + " to usersWhoHaveTalked.");
            this.usersWhoHaveTalked.add(user);
            if ( this.greetingsEnabled === true && this.greetings.has(user) ) {
                this.greetings.get(user)?.();
            }
        }
    }

    public getFirst(): string {
        let [actualFirst]: Set<string> = this.usersWhoHaveTalked;
        return actualFirst;
    }

    private actuallyFirstCheck(user: string, message: string): void {
        if (user === "CareFreeBomb") { return; }

        let messageModified: string = message.toLowerCase();
        messageModified = Util.String.removeNonAlphaNumeric(messageModified);
        messageModified = Util.String.removeWhiteSpace(messageModified);

        let first: string = this.getFirst();
        if (user !== first && (messageModified === "first" || messageModified === "1st")) {
            this.say("/timeout " + user + " 69 Was not actually first.");
            app.twitch.bot.say("Sorry, " + user + ", but " + first + " was actually first.");
        }
    }

    public checkCommand(data: CommandEventData) {
        // To determine if relevant command exists
        if (this.triggers.has(data.command)) {
            this.triggerAction(data.command, data);
        }
        // Then process the rest of message the same as any other
        this.handler(data);
    }

    public checkBits(data: CheerEventData) {
        // To determine what effects or notifs to play
        Bits.handler(data);
        // Then process the rest of the message the same as any other
        this.handler(data);
    }

    private checkTriggers(data: ChatEventData) {
        // Convert string to lowercase
        let message: string = data.message.toLowerCase();
        // Get all trigger possibilities with any !command prefixes already excluded
        let wordCombinations: Set<string> = Util.String.possibleCombinations(message); // removes non alpha-numeric
        // Compare possibilities set against actual commands / aliases set
        let foundTriggers: Set<string> = this.triggers.hasWhich(wordCombinations);
        // If there were any found, run them all up
        if (foundTriggers.size !== 0) {
            for (let key of foundTriggers) {
                this.triggerAction(key, data);
            }
        }
    }

    private async triggerAction(triggerStr: string, eventData: ChatEventData): Promise<void> {
        let trigger: ChatTrigger = this.triggers.get(triggerStr);
        trigger.run(eventData);
    }
}