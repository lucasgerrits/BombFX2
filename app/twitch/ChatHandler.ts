import { Bits } from "../../effects/bits/Bits.js";
import { BombFX } from "../BombFX.js";
import { ChatTrigger } from "./ChatTrigger.js";
import { GreetingMap } from "./GreetingMap.js";
import { Logger } from "../Logger.js";
import { secrets } from "../../data/secrets/secrets.js";
import { TriggerMap } from "./TriggerMap.js";
import { Util } from "../util/Util.js";
import type { ChatEventData, CheerEventData, CommandEventData } from "../../types/ComfyTypes.js";

/* eslint-disable no-var */
declare var app: BombFX;
declare var ComfyJS: any;
/* eslint-enable no-var */

export class ChatHandler {

    private greetingsEnabled = false;

    private usersWhoHaveTalked: Set<string>;
    private greetings: GreetingMap;
    public triggers: TriggerMap;

    private activeTimeouts: Map<string, number>;

    constructor() {
        this.triggers = new TriggerMap();
        this.usersWhoHaveTalked = new Set<string>();
        this.greetings = new GreetingMap();
        this.activeTimeouts = new Map<string, number>();
    }

    public async isUserTag(username: string): Promise<boolean> {
        return (username.substring(0, 1) === "@");
    }

    public async parseTagChar(username: string): Promise<string> {
        if (await this.isUserTag(username)) {
            return username.substring(1);
        } else {
            return username;
        }
    }

    public setActiveTimeout(username: string, jsTimeoutId: number): void {
        this.activeTimeouts.set(username, jsTimeoutId);
    }

    public hasActiveTimeout(username: string): boolean {
        return this.activeTimeouts.has(username);
    }

    public clearActiveTimeout(username: string): void {
        clearInterval(this.activeTimeouts.get(username));
    }

    public async say(msg: string): Promise<void> {
        ComfyJS.Say(msg);
    }

    public handler(data: ChatEventData) {
        this.firstFromUserCheck(data.user);
        this.actuallyFirstCheck(data.user, data.message);
        this.checkTriggers(data);
        //DonutBreak.handler(data.user, data.message, data.extra.id);
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
        const [actualFirst]: Set<string> = this.usersWhoHaveTalked;
        return actualFirst;
    }

    private actuallyFirstCheck(user: string, message: string): void {
        if (user === "CareFreeBomb" || user === "MilkBarkeep" || user === "Buttsbot" || user === "LumiaStream") { return; }

        let messageModified: string = message.toLowerCase();
        messageModified = Util.Strings.removeNonAlphaNumeric(messageModified);
        messageModified = Util.Strings.removeWhiteSpace(messageModified);

        const first: string = this.getFirst();
        if (user !== first && (messageModified === "first" || messageModified === "1st")) {
            app.twitch.chat.timeoutUser(user, 69, "Was not actually first.");
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
        const message: string = data.message.toLowerCase();
        // Get all trigger possibilities with any !command prefixes already excluded
        const wordCombinations: Set<string> = Util.Strings.possibleCombinations(message); // removes non alpha-numeric
        // Compare possibilities set against actual commands / aliases set
        const foundTriggers: Set<string> = this.triggers.hasWhich(wordCombinations);
        // If there were any found, run them all up
        if (foundTriggers.size !== 0) {
            for (const key of foundTriggers) {
                this.triggerAction(key, data);
            }
        }
    }

    private async triggerAction(triggerStr: string, eventData: ChatEventData): Promise<void> {
        const trigger: ChatTrigger = this.triggers.get(triggerStr);
        trigger.run(eventData);
    }

    public async timeoutUser(user: string, duration: number, reason: string = ""): Promise<void> {
        this.sbotTimeoutUser(user, duration, reason);
    }

    public async modUser(user: string): Promise<void> {
        this.sbotModUser(user);
    }

    public async announce(chatMessage: string): Promise<void> {
        this.sbotAnnounce(chatMessage);
    }

    public async deleteMessage(id: string): Promise<void> {
        //ComfyJS.GetClient().deletemessage(secrets.channel, id);
        this.sbotDeleteMessage(id);
    }

    // StreamerBot band-aid for deprecated IRC slash commands and ComfyJS methods

    private async sbotDeleteMessage(messageId: string): Promise<void> {
        const actionName: string = "Chat Delete";
        const args: Record<string, unknown> = {
            "chatMessageId": messageId
        };
        app.sbot.doAction(actionName, args);
    }

    private async sbotTimeoutUser(user: string, duration: number, reason: string = ""): Promise<void> {
        const actionName: string = "Timeout User";
        const args: Record<string, unknown> = {
            "user": user,
            "duration": duration,
            "reason": reason
        };
        app.sbot.doAction(actionName, args);
    }

    public async sbotModUser(user: string): Promise<void> {
        const actionName: string = "Mod User";
        const args: Record<string, unknown> = {
            "user": user
        };
        app.sbot.doAction(actionName, args);
    }

    public async sbotAnnounce(chatMessage: string): Promise<void> {
        const actionName: string = "Chat Announcement";
        const args: Record<string, unknown> = {
            "chatMessage": chatMessage
        };
        app.sbot.doAction(actionName, args);
    }
}