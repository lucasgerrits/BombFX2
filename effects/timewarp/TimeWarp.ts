import { BombFX } from "../../app/BombFX.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { PauseReward } from "../pause/Pause.js";
import { Reward } from "../../app/twitch/Reward.js";
import { RewardTriggerData } from "../../app/EventTriggerData.js";
import { Util } from "../../app/util/Util.js";
import { webhookURLs } from "../../data/secrets/urls.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class TimeWarpReward extends Reward {
    public static override id: string = "ee974f67-2543-408b-a946-7881c997c5ba";
    public static override title: string = "Time Warp";
    public static override cost: number = 500;

    constructor() {
        super(TimeWarpReward.id, TimeWarpReward.title, new TimeWarp());
    }
}

export class TimeWarp extends Effect {
    constructor() {
        super(EffectQueueName.Main);
    }
    
    public override async setup(): Promise<void> {
        PauseReward.pause();
    }

    public override async dismantle(): Promise<void> {
        PauseReward.resume();
    }

    public override async start(): Promise<void> {
        const webcamCloneSource: string = "Webcam Time Warp Clone";

        const minDuration: number = 10;
        const maxDuration: number = 30;

        // Get random duration of warp
        const randomDuration: number = Util.Numbers.getRandomIntegerInclusive(minDuration, maxDuration);
        const randomDurationInMS: number = randomDuration * 1000;

        // Get random angle for warp direction
        const randomAngle = Util.Numbers.getRandomIntegerInclusive(0, 360);

        // Remember current scene for transitioning back to later
        const currentScene: string = await app.obs.getCurrentSceneName();

        // Set random values to time warp filter settings
        app.obs.setSourceFilterSettings(webcamCloneSource, "Time Warp Scan", {
            "rotation" : randomAngle,
            "scan_duration" : randomDurationInMS
        });

        // Show portal opening circle
        await app.obs.showSource("Time Warp Portal Webm", "** Videos");

        // Play accompanying sounds
        Util.playSound("effects/timewarp/audio/portalreverb.mp3", 0.5);
        await Util.sleep(1800);
        Util.playSoundForDuration("effects/timewarp/audio/timegate.mp3", 
            3700 + randomDurationInMS);

        // Switch scene
        app.obs.setScene("Time Warp");
        await Util.sleep(2000);

        // Activate filter
        await app.obs.showFilter(webcamCloneSource, "Time Warp Scan");
        await Util.sleep(randomDurationInMS);

        // Put details of warp in Twitch chat
        const discordLink: string = "https://discord.gg/ZwG2V9bbjA";
        const chatString: string = "Angle: " + randomAngle + " degrees /" + 
            " Duration: " + randomDuration + " seconds. You can find all" +
            " of the time warped photos here: " + discordLink;
        app.twitch.bot.say(chatString);

        // Take screenshot of nested scene
        const filePath: string = "D:\\carefreebomb\\Twitch\\fx\\timewarp\\photos\\temp.png";
        //const filePath: string = "C:\\xampp\\htdocs\\fx2\\effects\\timewarp\\photos\\temp.png";
        const screenshotImageData: string = await app.obs.getSourceScreenshot("Time Warp Nested", filePath);

        // Upload screenshot to Discord channel
        this.uploadTimeWarpToDiscord(randomDuration, randomAngle, screenshotImageData);

        // Switch back to original scene
        await app.obs.setScene(currentScene);
        await Util.sleep(1000);

        // Restart portal circle video and relevant audio
        await app.obs.restartMedia("Time Warp Portal Webm");
        Util.playSound("effects/timewarp/audio/portalreverb.mp3", 0.5);
        await Util.sleep(1000);

        // Turn off time warp filter
        await app.obs.hideFilter(webcamCloneSource, "Time Warp Scan");
        await Util.sleep(2000);

        // Turn off portal circle video
        await app.obs.hideSource("Time Warp Portal Webm", "** Videos");
    }

    private async uploadTimeWarpToDiscord(duration: number, angle: number, screenshotImageData: string) {
        const data: RewardTriggerData = <RewardTriggerData> this.triggerData;

        const debug: boolean = false;

        let webhookURL: string;
        if (debug) {
            webhookURL = webhookURLs.testing;
        } else {
            webhookURL = webhookURLs.endoftime;
        }
        
        const time = new Date(data.timestamp);
        
        const str =   "Time Warp redeemed by **" + data.user + "** at " +
                    time.toLocaleTimeString("en-US") + " on " +
                    time.toDateString() + " for " + data.cost +
                    " PP. Effect duration: " + duration + " seconds " +
                    "/ Warp angle: " + angle + " degrees.";
        
        const imgFile: string = screenshotImageData;
        const block: Array<string> = imgFile.split(";");
        const contentType: string = block[0].split(":")[1];
        const encodedImage: string = block[1].split(",")[1];
        const blob = Util.Requests.base64ToBlob(encodedImage, contentType);
        
        const formData: FormData = new FormData();
        formData.append("image", blob, "temp.png");
        formData.append("content", str);
        //formData.append("payload_json", `{"content": "${str}""}`);
    
        const requestOptions: RequestInit = {
            method: "POST",
            body: formData,
            redirect: "follow"
        };
    
        const response: Response = await fetch(webhookURL, requestOptions);
    
        if (response.status == 401) {
            Logger.log("Invalid webhookURL or webhook Token.");
        }
    }
}