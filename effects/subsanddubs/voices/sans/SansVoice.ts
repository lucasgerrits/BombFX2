import { BombFX } from "../../../../app/BombFX.js";
import { ISubsAndDubsVoice } from "../../ISubsAndDubsVoice.js";
import { Logger } from "../../../../app/Logger.js";
import { SubsAndDubsVoice } from "../../SubsAndDubsVoice.js";
import { Util } from "../../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class SansVoice extends SubsAndDubsVoice implements ISubsAndDubsVoice {
    public async start(): Promise<void> {
        // Initialize text queues
        this.textQueue = new Array<string>();

        // Play Undertale battle start sound effect
        const battleStartSound = "effects/subsanddubs/voices/sans/audio/battlefall.mp3";
        Util.playSound(battleStartSound);

        // Create HTML divs
        this.createUndertaleDivs();
    }

    public async stop(): Promise<void> {
        // Play Undertale save game sound effect
        const saveGameSound = "effects/subsanddubs/voices/sans/audio/save.mp3";
        Util.playSound(saveGameSound);

        // Remove HTML divs
        this.removeUndertaleDivs();
    }

    public async displayText(text: string): Promise<void> {
        //
    }

    public async updateTimer(): Promise<void> {
        //
    }

    private async createUndertaleDivs(): Promise<void> {
        // Create the main effect box on screen
        const sansDiv = Object.assign(document.createElement("div"), {id: "sans-div", className: "sans-fade-in"});

        // Create the div that contains the text box and set id
        const sansTextDiv = Object.assign(document.createElement("div"), {id: "sans-text-div"});

        // Get main browser source container div, then append all relevant child divs to it
        const fxBox = document.getElementById("fx-box");
        fxBox.appendChild(sansDiv);
        sansDiv.appendChild(sansTextDiv);

        sansTextDiv.innerHTML = "<p>this is a test!!</p>" +
            "<p>this is a second line of text.</p>" +
            "<p>pee pee poo poo man</p>";
    }

    private async removeUndertaleDivs(): Promise<void> {
        // Get containing Sans effect div on screen and remove the Sans text div from it
        const sansDiv = document.getElementById("sans-div");
        const sansTextDiv = document.getElementById("sans-text-div");
        sansDiv.removeChild(sansTextDiv);

        // On containing Sans effect div, replace fadeIn class with fadeOut class
        sansDiv.classList.remove("sans-fade-in");
        sansDiv.classList.add("sans-fade-out");

        await Util.sleep(400);

        // Get main browser source container div and remove the Undertale boxes
        const fxBox = document.getElementById("fx-box");
        fxBox.removeChild(fxBox.firstChild);
    }
}