import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import type { SoundExistenceData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class SFXReward extends Reward {
    public static override id: string = "c6ef96d2-97c0-4fe1-b6b1-3a802cedb25c";
    public static override title: string = "SFX";
    public static override cost: number = 250;

    constructor() {
        super(SFXReward.id, SFXReward.title, new SoundEffect());
        this.allowedOnBRB = true;
    }
}

export class SFXDoubleSpeedReward extends Reward {
    public static override id: string = "24c293ac-87ad-4b2e-b86d-23f990b95430";
    public static override title: string = "SFX Double Speed";
    public static override cost: number = 150;

    constructor() {
        super(SFXDoubleSpeedReward.id, SFXDoubleSpeedReward.title, new SoundEffect(2.0));
        this.allowedOnBRB = true;
    }
}

export class SFXQuarterSpeedReward extends Reward {
    public static override id: string = "ab1ae33b-8db9-472c-bebd-754c8409989a";
    public static override title: string = "SFX Quarter Speed";
    public static override cost: number = 700;

    constructor() {
        super(SFXQuarterSpeedReward.id, SFXQuarterSpeedReward.title, new SoundEffect(0.25));
        this.allowedOnBRB = true;
    }
}

export class SFXBombReward extends Reward {
    public static override id: string = "30094888-08e9-4413-92cf-37d64500aeb7";
    public static override title: string = "SFX Bomb";
    public static override cost: number = 5000;

    constructor() {
        super(SFXBombReward.id, SFXBombReward.title, new SoundEffect(0.25, true));
        this.allowedOnBRB = true;
    }
}

export class SoundEffect extends Effect {
    private playbackSpeed: number;
    private bomb: boolean;

    constructor(speedIn: number = 1.0, bombIn: boolean = false) {
        super(EffectQueueName.None);
        this.playbackSpeed = speedIn;
        this.bomb = bombIn;
    }
    
    public override async start(): Promise<void> {
        
        // Modify input string
        let message: string = this.triggerData.message;
        message = message.toLowerCase();
        message = Util.Strings.removeNonAlphaNumeric(message);
        message = Util.Strings.removeWhiteSpace(message);

        // Stop if Hyrule does something he's not supposed to
        if (!this.lolHyruleChecks(message)) {
            return;
        } else if (message === "konatres") {
            app.twitch.bot.say("¡¿TRES?!");
        }

        // Try playing sound file
        if (this.bomb) {
            SFX.bomb(message, this.triggerData.user);
        } else {
            SFX.play(message, this.playbackSpeed);
        }
    }

    private lolHyruleChecks(message: string): boolean {
        if (this.triggerData.user === "HyruleHero" && 
            (message === "usbin" || message === "usbout"))
        {
            app.twitch.bot.say("/timeout HyruleHero 69", true);
            app.twitch.bot.say("User isn't allowed near USB ports.");
            return false;
        }
        else {
            return true;
        }
    }
}

export abstract class SFX {
    public static async play(name: string, playbackRate: number = 1.0): Promise<void> {
        const filename: string = "effects/sfx/sounds/" + name + ".mp3";
        try {
            const soundCheck: SoundExistenceData = await SFX.soundExists(filename);
            if (soundCheck.exists) {
                soundCheck.audio.playbackRate = playbackRate;
                soundCheck.audio.play();
            } else {
                const errorMessage: string = "Ain't no such sound file: " + name;
                Logger.error(errorMessage);
                app.twitch.bot.say(errorMessage);
            }
        } catch(err) {
            Logger.error(err.toString());
        }
    }

    private static soundExists(filename: string): Promise<SoundExistenceData> {
        return new Promise((resolve, reject) => {
            try {
                const audioToCheck = new Audio(filename);
                audioToCheck.oncanplay = () => {
                    resolve({ exists: true, audio: audioToCheck });
                };
                audioToCheck.onerror = () => {
                    resolve({ exists: false, audio: null });
                };
            } catch(err) {
                Logger.error(err.toString());
            }
        });
    }

    public static async bomb(name: string, user: string): Promise<void> {
        const numberOfSounds = Util.Numbers.getRandomIntegerInclusive(10, 15);
        const filename: string = "effects/sfx/sounds/" + name + ".mp3";
        try {
            const soundCheck: SoundExistenceData = await SFX.soundExists(filename);
            if (soundCheck.exists) {
                if (name.includes("doro")) {
                    app.twitch.bot.say("PepeSpin YOU HAVE ENTERED, THE DORO ZONE PepeSpin");
                }
                const chatStr: string = user + " has provided chat with a delightful treat of " +
                    numberOfSounds + " [" + name + "]'s.";
                app.twitch.bot.say(chatStr);
                soundCheck.audio.playbackRate = 0.25;
                for (let i: number = 0; i < numberOfSounds; i++) {
                    const delay: number = Util.Numbers.getRandomIntegerInclusive(100, 3000);
            
                    setTimeout((audio: HTMLAudioElement) => {
                        const newAudio = new Audio(audio.src);
                        newAudio.play();
                    }, delay, soundCheck.audio);
                }
            } else {
                const errorMessage: string = "Ain't no such sound file: " + name;
                Logger.error(errorMessage);
                app.twitch.bot.say(errorMessage);
            }
        } catch(err) {
            Logger.error(err.toString());
        }
    }
}
