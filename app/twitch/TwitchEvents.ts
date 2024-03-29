import { BombFX } from "../BombFX.js";
import { Effect } from "../Effect.js";
import { ChatEventTriggerData, EventTriggerData, RewardTriggerData } from "../EventTriggerData.js";
import { Timeout } from "../../effects/timeouts/Timeouts.js";
import { Logger } from "../Logger.js";
import type { ChatEventData, ChatExtra, ChatFlags, CheerEventData, CommandEventData, CommandExtra, RewardExtra } from "../../types/ComfyTypes.js";

/* eslint-disable no-var */
declare var app: BombFX;
declare var ComfyJS: any;
/* eslint-enable no-var */

ComfyJS.onConnected = (address: string, port: number, isFirstConnect: boolean) => {
    Logger.twitch("Connected to " + address + ":" + port);
};

ComfyJS.onReconnect = (reconnectCount: number) => {
    Logger.twitch("Reconnect #" + reconnectCount);
};

ComfyJS.onError = (error: any) => {
    Logger.twitch("Error");
    console.log(error);
};

ComfyJS.onChat = (user: string, message: string, flags: ChatFlags, self: boolean, extra: ChatExtra) => {
    if (user === "MilkBarkeep" || user === "KonaVanilla" || user === "Buttsbot") return; // Ignore bots

    const data: ChatEventData = {
        user: user,
        message: message,
        flags: flags,
        self: self,
        extra: extra
    };

    app.twitch.chat.handler(data);
};

ComfyJS.onCommand = (user: string, command: string, message: string, flags: ChatFlags, extra: CommandExtra ) => {
    if (user === "MilkBarkeep") return; // Ignore bots

    const data: CommandEventData = {
        user: user,
        message: message,
        flags: flags,
        extra: extra,
        command: "!" + command
    }; // message does already exclude command portion

    app.twitch.chat.checkCommand(data);
};

ComfyJS.onReward = (user: string, reward: string, cost: number, message: string, extra: RewardExtra) => {

    // Check for duplicate redemption ID to prevent unexplained multiple events
    if (app.twitch.lastRedeemedID !== undefined && extra.customRewardId === app.twitch.lastRedeemedID) {
        return;
    }

    app.twitch.lastRedeemedID = extra.customRewardId;

    const data: RewardTriggerData = new RewardTriggerData({
        user, reward, cost, message, extra
    });

    app.twitch.checkRedemption(data);
};

ComfyJS.onCheer = async (user: string, message: string, bits: number, flags: ChatFlags, extra: ChatExtra) => {

    const data: CheerEventData = {
        user: user,
        message: message,
        bits: bits,
        flags: flags,
        extra: extra
    }; // message includes cheermotes and needs parsing (Cheer20)
    
    app.twitch.chat.checkBits(data);
};

ComfyJS.onTimeout = (timedOutUsername: string, durationInSeconds: number, extra: object) => {
    const notifDuration: number = (durationInSeconds + 1) * 1000;

    console.log(extra);

    if (!app.twitch.chat.hasActiveTimeout(timedOutUsername)) {
        //const effect: Effect = new Timeout();
        //effect.setTriggerData(new EventTriggerData());

        const id: number = setTimeout(function(username: string, timeoutDuration: number) {
            let str: string = timeoutDuration + " second timeout on " + 
                username + " complete.";
            if ( app.twitch.isMod(username) === true ) {
                app.twitch.chat.modUser(username);
                str += " Remodding.";
            }
            app.twitch.chat.clearActiveTimeout(timedOutUsername);
            app.twitch.bot.say(str);
        }, notifDuration, timedOutUsername, durationInSeconds);

        app.twitch.chat.setActiveTimeout(timedOutUsername, id);
    }
};