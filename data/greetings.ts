import { BombFX } from "../app/BombFX.js";
import { SFX } from "../effects/sfx/SFX.js";
import { Util } from "../app/util/Util.js";
import type { Greeting } from "../types/AppTypes";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const greetings: Array<Greeting> = [
    {
        user: "bigwill2k",
        action: async () => {
            SFX.play("bigwill");
            app.twitch.bot.say("BIG WILL, DRU HILL");
        }
    }, {
        user: "Blast_CH",
        action: async () => {
            SFX.play("cfbjazz");
        }
    }, {
        user: "doronyaa",
        action: async () => {
            Util.playSound("effects/greetings/doro.mp3");
            await app.obs.showSource("Doro Greeting Gif", "** Mega Overlay");
            await Util.sleep(2500);
            await app.obs.hideSource("Doro Greeting Gif", "** Mega Overlay");
        }
    }, {
        user: "EazyWithIt",
        action: async () => {
            Util.playSound("effects/greetings/eazyf.mp3");
        }
    }, {
        user: "KonaChocolate",
        action: async () => {
            await app.obs.showSource("Kona Greeting", "** Videos");
            await Util.sleep(8000);
            await app.obs.hideSource("Kona Greeting", "** Videos");
        }
    }, {
        user: "LloydThePirate",
        action: async () => {
            Util.playSound("effects/greetings/lloyd.mp3");
        }
    }, {
        user: "nate1280",
        action: async () => {
            app.twitch.bot.say("CREATOR NATE IS HERE bombHandsUp");
        }
    }, {
        user: "noushy1",
        action: async () => {
            Util.playSound("effects/greetings/noushy.mp3");
        }
    }, {
        user: "rev_yara",
        action: async () => {
            SFX.play("grbrbhrrh");
        }
    }, {
        user: "Thegirlonfire99",
        action: async () => {
            SFX.play("slothfall");
            app.twitch.bot.say("[sloth emoji] it deni");
        }
    }, {
        user: "TheMissVic",
        action: async () => {
            SFX.play("forreal");
        }
    }
];