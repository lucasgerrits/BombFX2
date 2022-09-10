import type { ChatTriggerData } from "../../types/AppTypes";

export const socialTriggers: Array<ChatTriggerData> = [
    {
        trigger: "!boinglist",
        aliases: ["!zoomlist", "!boingzoomlist"],
        action: "Entire list of Mr. Saturn Quotes: http://www.carefreebomb.com/nightbot/boingzoom.php?showall"
    }, {
        trigger: "!discord",
        aliases: ["discord"],
        cooldown: 300,
        action: "https://discord.gg/0X84YV4Sn1v0wyUa"
    }, {
        trigger: "!extralife",
        aliases: ["!el", "Extra Life"],
        action: "CFB is participating in Extra Life, an annual 24-hour gaming marathon benefiting Children's Miracle Network on Saturday, November 5th. You can make a donation to help sick kids in need here (not through Twitch, please): https://www.extra-life.org/participant/carefreebomb"
    }, {
        trigger: "!facebook",
        aliases: ["!fb"],
        action: "https://www.facebook.com/carefreebomb/"
    }, {
        trigger: "!gartic",
        action: "https://www.carefreebomb.com/joingartic"
    }, {
        trigger: "!github",
        aliases: ["!git", "!code", "!fx2"],
        action: "https://github.com/lucasgerrits/BombFX2"
    }, {
        trigger: "!gmod",
        aliases: ["!ttt"],
        action: "Thanks to @DRock4Real1324 for hosting the server! - IP: 65.31.255.217 Password: bombsquad"
    }, {
        trigger: "!instagram",
        aliases: ["!insta", "!ig", "!gram"],
        action: "https://www.instagram.com/care.free.bomb/"
    }, {
        trigger: "!kofi",
        action: "https://ko-fi.com/carefreebomb"
    }, {
        trigger: "!onlyfans",
        aliases: ["onlyfans"],
        action: "https://www.carefreebomb.com/onlyfans"
    }, {
        trigger: "!ra",
        aliases: ["ra", "Retro Achievements"],
        action: "RetroAchievements uses modified emulators to track a user's progress throughout many old games via their website. You can find my profile here: http://retroachievements.org/user/carefreebomb"
    }, {
        trigger: "!requests",
        aliases: ["!request", "!clone", "!clonehero", "!songs", "!songlist"],
        action: "Search this page for all Clone Hero songs: https://chorus.fightthe.pw/ If I don't have it, I can get it via the Bridge app."
    }, {
        trigger: "!rouletterequest",
        action: "You can make game suggestions to BootToucher for future Retro Roulettes by using this Google Form: http://www.carefreebomb.com/roulette/request"
    }, {
        trigger: "!socials",
        action: "Hey, follow me on Twitter and Instagram because I actually use those. This is not a request, it is a demand: https://www.twitter.com/carefreeb0mb https://www.instagram.com/care.free.bomb/"
    }, {
        trigger: "!specs",
        aliases: ["!pc"],
        action: "CPU: Intel Core i9-9900K 3.6 GHz 8-Core ... GPU: EVGA GeForce RTX 2080 SUPER 8 GB BLACK ... RAM: G.Skill Ripjaws V Series 32GB DDR4-3200 ... MOBO: Asus PRIME Z390-P ATX LGA1151 ... Storage 1: Samsung 970 Evo 1 TB M.2-2280 NVME ... Storage 2: Western Digital Black 4 TB 3.5\" 7200RPM ... Cooler: Cooler Master MasterLiquid ML240L RGB ... PSU: Corsair TXM Gold 750W Semi-modular ATX ... Case: Phanteks P300 ATX Mid Tower Black"
    }, {
        trigger: "!steam",
        action: "https://steamcommunity.com/id/piratelukeyo/"
    }, {
        trigger: "!storytime",
        action: "Here is a list of story books available: http://www.carefreebomb.com/nightbot/storytime.txt"
    }, {
        trigger: "!switch",
        aliases: ["!fc", "!friendcode", "!switchfc"],
        action: "Here is my Switch friend code: SW-8157-6568-1108"
    }, {
        trigger: "!tiktok",
        action: "I don't make any videos... yet: https://www.tiktok.com/@carefreebomb"
    }, {
        trigger: "!tip",
        aliases: ["!donate"],
        action: "https://streamelements.com/carefreebomb/tip"
    }, {
        trigger: "!twitter",
        action: "https://twitter.com/carefreeb0mb"
    }, {
        trigger: "!venmo",
        action: "@carefreebomb"
    }, {
        trigger: "!wacom",
        aliases: ["!tablet"],
        action: "Wacom Intuos 4 (Wired, Medium): https://www.amazon.com/Wacom-Intuos4-Large-Pen-Tablet/dp/B001TUYTZW?th=1"
    }, {
        trigger: "!wiki",
        action: "https://carefreebomb.com/wiki"
    }
];