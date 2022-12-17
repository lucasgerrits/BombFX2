import type { ChatTriggerData } from "../../types/AppTypes";

export const linkTriggers: Array<ChatTriggerData> = [
    {
        trigger: "!aroo",
        action: "https://www.acapela-group.com/vocal-smileys-examples/"
    }, {
        trigger: "!devotion",
        action: "https://thediplomat.com/2020/12/taiwanese-horror-game-devotion-gets-pulled-again-over-chinese-objections/"
    }, {
        trigger: "!dice",
        action: "FOLLOW DICE https://www.twitch.tv/dice_the_vice"
    }, {
        trigger: "!exeldro",
        action: "Many of the OBS plugins used in this stream are created by Exeldro and can be found here: " +
            "https://obsproject.com/forum/resources/authors/exeldro.128836/"
    }, {
        trigger: "!feetpic",
        action: "https://cdn.discordapp.com/attachments/888257851187941377/1014923889610080356/image-3.png"
    }, {
        trigger: "!ffxiv",
        aliases: ["ffxiv", "ff14", "heavensward"],
        cooldown: 60,
        announceCD: false,
        action: "Did you know that the critically acclaimed MMORPG Final Fantasy XIV has a free trial, and includes the entirety of A Realm Reborn AND the award-winning Heavensward expansion up to level 60 with no restrictions on playtime? Sign up, and enjoy Eorzea today! https://secure.square-enix.com/account/app/svc/ffxivregister?lng=en-gb"
    }, {
        trigger: "!friday",
        aliases: ["!ifyoucanbelieveit", "!fridaysong", "!fridayonceagain"],
        action: "https://www.youtube.com/watch?v=5Ib_PrnSi50"
    }, {
        trigger: "!heat",
        aliases: ["!heatmap", "!heatplugin", "!screenclicks"],
        action: "https://heat.j38.net/"
    }, {
        trigger: "!nsfw",
        aliases: ["!dittoconga", "!dittokonga"],
        action: "https://matias.ma/nsfw/"
    }, {
        trigger: "!oz",
        aliases: ["ozkai"],
        action: "OZKai makes cool traditional art pieces primarily using markers, with interests including Gundam and Metroid. He is also working on his own book series, and you can reach him via Twitter here: https://twitter.com/OZKai and on his Patreon here: https://www.patreon.com/studioozkai/"
    }, {
        trigger: "!polly",
        aliases: ["!voices"],
        action: "You can test out (almost) all of the Amazon Polly voices here: https://ai-service-demos.go-aws.com/polly"
    }, {
        trigger: "!pronouns",
        action: "Set your pronouns here please, lovely people: https://pronouns.alejo.io/"
    }, {
        trigger: "!streamerbot",
        aliases: ["!sb", "!sbot"],
        action: "https://streamer.bot"
    }, {
        trigger: "!timewarp",
        aliases: ["!timewarpplugin"],
        action: "https://obsproject.com/forum/resources/time-warp-scan.1167/"
    }
];