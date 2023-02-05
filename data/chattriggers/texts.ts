import { BombFX } from "../../app/BombFX.js";
import { Util } from "../../app/util/Util.js";
import type { ChatTriggerData } from "../../types/AppTypes";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const textTriggers: Array<ChatTriggerData> = [
    {
        trigger: "appreciate",
        action: "Alternatives: thankful, grateful, flattered, glad, tickled pink, pleased, indebted, contented, ecstatic, delighted, much obliged"
    }, {
        trigger: "baronv18Hibomb",
        action: async () => {
            app.twitch.chat.say("carefr3HiBaron");
        }
    }, {
        trigger: "!bong",
        aliases: ["!zoom", "!boingzoom"],
        action: "http://www.carefreebomb.com/nightbot/boingzoom.php",
        fetch: true
    }, {
        trigger: "!curtspecial",
        action: "rice, potatoes, chicken, avocado, carrots, hot sauce/soy sauce"
    }, {
        trigger: "!dad",
        action: "Guys I think it's time"
    }, {
        trigger: "!faces",
        aliases: ["!quarry"],
        action: "is it just me or are the faces somehow a bit off in this game"
    }, {
        trigger: "fuzzy pickles",
        cooldown: 60,
        announceCD: false,
        action: "Fuzzy Pickles!!"
    }, {
        trigger: "!gamba",
        action: "(Values are based on shop costs) Piece of Heart > Rupees (100) > Rupees(50) > Arrows(10) > Rupees(20) > Heart > Bomb(1) > Arrow(1) > Rupee(1)"
    }, {
        trigger: "!greg",
        action: "In case you are unaware, we are dating! :angry:"
    }, {
        trigger: "have you ever",
        action: "Have you ever thought about what it would be like to be a bee??"
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
        trigger: "leclumpout",
        action: "Hasty's tears fuel the Nightbo...Barkeep."
    }, {
        trigger: "!multi",
        action: "https://kadgar.net/live/baloojay/carefreebomb"
    }, {
        trigger: "!nate",
        aliases: ["!nate1280"],
        action: "CREATOR NATE IS HERE bombHandsUp"
    }, {
        trigger: "!nevtime",
        action: "http://www.carefreebomb.com/nightbot/uk_time.php",
        fetch: true
    }, {
        trigger: "np",
        cooldown: 10,
        action: "np np np np"
    }, {
        trigger: "!promise",
        action: "\"cfb, you hot, moist garbage, you promised\" - MisterC_4"
    }, {
        trigger: "!re1",
        action: "This Is My Daily Campaign To Get Jammy To Purchase and Play Resident Evil Remake On GameCube"
    }, {
        trigger: "!spacedock",
        aliases: ["!spacedockin", "!spacedocking"],
        action: "I WANNA GO!! SPACEDOCKIN!!!!"
    }, {
        trigger: "!toxic",
        action: "You have been muted for receiving significantly more communications abuse reports than most players. Players will not see your communication unless they choose to unmute you."
    }, {
        trigger: "!weekstream",
        aliases: ["!oneweek", "!uptime"],
        action: "http://www.carefreebomb.com/nightbot/weekstream.php",
        fetch: true
    }, {
        trigger: "!wetkiss",
        action: "A wet wet kiss to u bro. yaaayyyyy that sluspilsuspslsu"
    }
];