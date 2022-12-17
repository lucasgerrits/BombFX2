import { BombFX } from "../../app/BombFX.js";
import { hostURLs } from "../../data/secrets/urls.js";
import { Effect } from "../../app/Effect.js";
import { EffectQueueName } from "../../app/EffectQueue.js";
import { Logger } from "../../app/Logger.js";
import { Reward } from "../../app/twitch/Reward.js";
import { Util } from "../../app/util/Util.js";
import type { CowLaunchData } from "../../types/EffectTypes.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class CowReward extends Reward {
    public static override id: string = "99c33e04-1d1b-4f7e-8c38-0b3a510e9d3e";
    public static override title: string = "Launch a Cow";
    public static override cost: number = 2000;

    constructor() {
        super(CowReward.id, CowReward.title, new Cow());
        this.allowedOnBRB = true;
    }
}

export class GoldenCowReward extends Reward {
    public static override id: string = "af4adb9c-376e-4268-b699-4a88cfc4fc84";
    public static override title: string = "GOLDEN COW";
    public static override buttonColor: string = "#FDDF2C";
    public static override cost: number = 1;

    constructor() {
        super(GoldenCowReward.id, GoldenCowReward.title, new Cow(true), GoldenCowReward.buttonColor);
    }
}

export class Cow extends Effect {
    private isGolden: boolean;
    private goldenDelay: number;

    constructor(golden: boolean = false) {
        super(EffectQueueName.Main);
        this.isGolden = golden;
    }

    public override async start(): Promise<void> {
        let source: string = "Cow Launch Dot Webm";

        // If golden cow, deactivate golden cow reward
        if (this.isGolden === true) {
            GoldenCowReward.disable();
            source = "Golden " + source;
        }

        // Update redeemer's launch count
        let url: string = hostURLs.addCowLaunch + "?user=" + 
            this.triggerData.user + "&golden=" + Number(this.isGolden);
        await Util.Requests.makeRequest(url, "GET");

        // Get redeemer's launch count
        url = hostURLs.getCowLaunchCount + "?user=" + this.triggerData.user + "&format=json";
        const result = await Util.Requests.makeRequest(url, "GET");
        const json: any = JSON.parse(result.response);
        const data: CowLaunchData = {
            user_name: json.user_name,
            most_recent: json.most_recent,
            rank: json.rank,
            launches: json.launches,
            total_users: json.total_users,
            total_launches: json.total_launches
        };
        

        // Display launch vid
        await app.obs.showSource(source, "** Videos");
        await Util.sleep(4200);

        // Display text div
        this.createCowDivs(data);

        // Send user launch stats to Twitch chat
        this.chatUserStats(data.user_name);

        // Post overall leaderboard to Twitch chat
        this.chatLeaderboard();

        // Determine golden cow proc
        this.determineGoldenProc();
        await Util.sleep(3000);

        // Remove text divs
        this.removeCowDivs();
        await Util.sleep(1600);

        // Hide launch vid
        await app.obs.hideSource(source, "** Videos");
        Util.sleep(1000);
    }

    private async chatUserStats(user: string): Promise<void> {
        const url: string = hostURLs.getCowLaunchCount + "?user=" + user;
        const result = await Util.Requests.makeRequest(url, "GET");
        //console.log(result.response);
        app.twitch.bot.say(result.response);
    }

    private async chatLeaderboard(): Promise<void> {
        const url: string = hostURLs.cowLeaderboard;
        const result = await Util.Requests.makeRequest(url, "GET");
        //console.log(result.response);
        app.twitch.bot.say(result.response);
    }

    private async determineGoldenProc(): Promise<void> {
        if (!this.isGolden) {
            this.goldenDelay = Util.Numbers.getRandomIntegerInclusive(15, 90);
            const chance: number = Util.Numbers.getRandomIntegerInclusive(1, 100);
            Logger.noise("Golden Cow Roll: " + chance);
            if (chance <= 4) {
                Logger.log("GOLDEN COW PROC!");
                setTimeout(async function() {
                    GoldenCowReward.enable();
                }, this.goldenDelay * 1000);
            }
        }
    }

    private createCowDivs(data: CowLaunchData): void {
        // Create username box
        if (data.user_name.length > 15) {
            const newWidth: number = Math.trunc(1790 / data.user_name.length);
            document.documentElement.style.setProperty("--cow-char-width", newWidth + "px");
        }
        this.createCowDiv("cow-name-box", data.user_name);
        
        // Create launch number box
        this.createCowDiv("cow-launches-box", data.launches);
        
        // Create rank number box "cow-rank-box"
        const rankString: string = "Rank " + data.rank + " of " + data.total_users;
        this.createCowDiv("cow-rank-box", rankString);
    }

    private createCowDiv(id: string, str: string) {
        const fxBox: HTMLElement = document.getElementById("fx-box");
        const newDiv: HTMLDivElement = document.createElement("div");
        newDiv.setAttribute("id", id);
        newDiv.innerHTML = this.createJimString(str);
        fxBox.appendChild(newDiv);
    }

    private removeCowDivs(): void {
        const fxBox: HTMLElement = document.getElementById("fx-box");
        while (fxBox.firstChild) {
            fxBox.removeChild(fxBox.firstChild);
        }
    }

    private createJimString(stringIn: string): string {
        // Split input string up into an array of characters
        const lowerCase: string = stringIn.toLowerCase();
        const charArray: Array<string> = lowerCase.split("");
        let jimString: string = "";

        // For each char, add a matching img element to output HTML string
        for (let i = 0; i < charArray.length; i++) {
            if (charArray[i] === " ") {
                jimString += "<img src='effects/cow/char/space.png' class='cow-space'>";
            } else {
                jimString += "<img src='effects/cow/char/" + charArray[i] + ".png'>";
            }
        }
        // The converted HTML for the Earthworm Jim font
        return jimString;
    }
}