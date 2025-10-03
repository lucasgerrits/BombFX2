import { BombFX } from "../../app/BombFX.js";
import { UserLevel } from "../../app/Enums.js";
import { Util } from "../../app/util/Util.js";
import type { ChatTriggerData } from "../../types/AppTypes";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const textTriggers: Array<ChatTriggerData> = [
    {
        trigger: "appreciate",
        action: "Alternatives: thankful, grateful, flattered, glad, tickled pink, pleased, indebted, contented, ecstatic, delighted, BUT DON'T USE MUCH OBLIGED"
    }, {
        trigger: "barkeep no",
        aliases: ["no barkeep", "barkeep bad", "bad barkeep", "milkbarkeep no", "no milkbarkeep", "milkbarkeep bad", "bad milkbarkeep"],
        action: ":("
    }, {
        trigger: "barkeep yes",
        aliases: ["yes barkeep", "barkeep good", "good barkeep", "milkbarkeep yes", "yes milkbarkeep", "milkbarkeep good", "good milkbarkeep"],
        action: ":)"
    }, {
        trigger: "baronv18hibomb",
        permittedUsers: ["Baronvcreepy"],
        action: async () => {
            app.twitch.chat.say("carefr3HiBaron");
        }
    }, {
        trigger: "!boing",
        aliases: ["!zoom", "!boingzoom"],
        action: "http://www.carefreebomb.com/nightbot/boingzoom.php",
        fetch: true
    }, {
        trigger: "!dmc",
        action: "I don't know who needs this information but the DMC HD collection is less than $10 on steam right now"
    }, {
        trigger: "fuzzy pickles",
        cooldown: 60,
        announceCD: false,
        action: "Fuzzy Pickles!!"
    }, {
        trigger: "!gamba",
        action: "(Values are based on shop costs) Piece of Heart > Rupees (100) > Rupees(50) > Arrows(10) > Rupees(20) > Heart > Bomb(1) > Arrow(1) > Rupee(1)"
    }, {
        trigger: "!goodmorning",
        action: "I go to bed 😴 🛌 CFB 💯 🙏 I wake up 🌄 😁 It's CFB 😤 🙌"
    }, {
        trigger: "have you ever",
        action: "Have you ever thought about what it would be like to be a bee??"
    }, {
        trigger: "huge raid",
        announceCD: false,
        action: async (data) => {
            if (data.user === "iambearnow") {
                app.twitch.chat.deleteMessage(data.extra.id);
            }
        }
    }, {
        trigger: "itchy",
        action: async () => {
            app.twitch.bot.say("Itchy.");
            await Util.sleep(1000);
            app.twitch.bot.say("Tasty.");
        }
    }, {
        trigger: "!itsnot",
        action: "\"It's not sexual!!\""
    }, {
        trigger: "!promise",
        action: "\"cfb, you hot, moist garbage, you promised\" - MisterC_4"
    }, {
        trigger: "!re1",
        action: "This Is My Daily Campaign To Get Jammy To Purchase and Play Resident Evil Remake On GameCube"
    }, {
        trigger: "!toxic",
        action: "You have been muted for receiving significantly more communications abuse reports than most players. Players will not see your communication unless they choose to unmute you."
    }, {
        trigger: "!wetkiss",
        action: "A wet wet kiss to u bro. yaaayyyyy that sluspilsuspslsu"
    }
];