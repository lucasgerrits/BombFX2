import { BombFX } from "../BombFX.js";
import { Logger } from "../Logger.js";
import { UserLevel } from "../Enums.js";
import { Util } from "../util/Util.js";
import type { ChatEventData } from "../../types/ComfyTypes";
import type { ChatTriggerData } from "../../types/AppTypes";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class ChatTrigger {
    private triggerData: ChatTriggerData; // what is action and how is it activated
    public eventData: ChatEventData; // who activated and with what (user, message, flags, extra)

    public action: string | ((data?: ChatEventData) => Promise<void>);
    public fetch: boolean = false;

    public cdInSec: number = 0;
    public cdInMS: number = 0;
    public isOnCD: boolean = false;
    public isPaused: boolean = false;
    public announceCD: boolean = true;

    constructor(dataIn: ChatTriggerData) {
        this.triggerData = dataIn;
        if (dataIn.cooldown) {
            this.cdInSec = dataIn.cooldown;
            this.cdInMS = this.cdInSec * 1000;
        }
        if (dataIn.fetch) {
            this.fetch = true;
        }
        if (dataIn.announceCD === false) {
            this.announceCD = dataIn.announceCD;
        }
        this.action = this.triggerData.action;
    }

    public activateCD() {
        this.isOnCD = true;
        setTimeout(() => {
            this.isOnCD = false;
        }, this.cdInMS);
    }

    public pause(): void {
        this.isPaused = true;
    }

    public resume(): void {
        this.isPaused = false;
    }

    public async run(eventIn: ChatEventData): Promise<void> {
        this.eventData = eventIn;

        // First determine if user is proper level
        if (this.checkIfPermittedUser() || this.checkIfRequiredUserLevel()) {
            // Then determine if trigger is still on cooldown from previous use
            if (!this.checkIfOnCooldown()) {
                // If it was not (and has a cd time set), it is now
                if (this.cdInSec > 0) {
                    this.activateCD();
                }
                // If trigger action is just a string, output it
                if (typeof this.triggerData.action === "string") {
                    let msg: string = this.triggerData.action;
                    // String may also be a url for fetching a response to ouput
                    if (this.triggerData.fetch) {
                        const result = await Util.Requests.makeRequest(this.triggerData.action);
                        msg = result.response;
                    }
                    app.twitch.bot.say(msg);
                // Otherwise call the associated function
                } else {
                    this.triggerData.action(this.eventData);
                }
            }
        }
    }

    private checkIfRequiredUserLevel(): boolean {
        // If no required level specified or user is CFB
        if (!this.triggerData.userLevel || this.eventData.flags.broadcaster ||
            // If required level is mod and user is mod
            (this.triggerData.userLevel === UserLevel.Moderator && this.eventData.flags.mod) ||
            // If required level is vip and user is vip or mod
            (this.triggerData.userLevel === UserLevel.VIP && (this.eventData.flags.vip || this.eventData.flags.mod)))
        {
            return true;
        } else {
            app.twitch.bot.say("Sorry, " + this.eventData.user + ", but you just ain't poggy enough for that command.");
            return false;
        }
    }

    private checkIfPermittedUser(): boolean {
        if (this.triggerData.permittedUsers && this.triggerData.permittedUsers.includes(this.eventData.user)) {
            return true;
        } else {
            return false;
        }
    }

    private checkIfOnCooldown(): boolean {
        if (this.isPaused || this.isOnCD) {
            if (this.isPaused) {
                app.twitch.bot.say("Sorry, " + this.eventData.user + ", that command is temporarily paused.");
            } else if (this.isOnCD) {
                if (this.announceCD === true) {
                    app.twitch.bot.say("Sorry " + this.eventData.user + ", that command has a " + this.cdInSec + " second cooldown.");
                } else {
                    Logger.noise("Silent CD for " + this.eventData.user + " of " + this.cdInSec + " seconds.");
                }
            }
            return true;
        } else {
            return false;
        }
    }
}