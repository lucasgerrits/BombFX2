import { BombFX } from "../../../../app/BombFX.js";
import { ISubsAndDubsVoice } from "../../ISubsAndDubsVoice.js";
import { Logger } from "../../../../app/Logger.js";
import { SubsAndDubsVoice } from "../../SubsAndDubsVoice.js";
import { Util } from "../../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;
declare const Animalese: any;

export class NookVoice extends SubsAndDubsVoice implements ISubsAndDubsVoice {
    private static wapowSound: string = "effects/subsanddubs/voices/nook/audio/ACItemFanfare.mp3";
    private static acVideoFile: string = "effects/subsanddubs/voices/nook/NookWithCFB.webm";

    private animalizer: any;
    private animalAudioObject: HTMLAudioElement;
    private isMakingAnimalese: boolean = false;

    private currentPhrase: Array<string>;
    private currentWord: Array<string>;
    private textToBeSpokenQueue: Array<string>;
    
    public async start(): Promise<void> {
        // Initialize text queues
        this.textQueue = new Array<string>();
        this.textToBeSpokenQueue = new Array<string>();

        // Initialize Animalese script
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.animalizer = new Animalese("effects/subsanddubs/voices/nook/animalese/animalese.wav", function() {});
        this.animalAudioObject = new Audio();
        this.animalAudioObject.volume = 0.5;

        // Play Animal Crossing Wapow sound
        Util.playSound(NookVoice.wapowSound);

        // Create HTML divs
        this.createAnimalCrossingDivs();

        // Mute microphone input
        app.obs.muteMic();
    }

    public async stop(): Promise<void> {
        // In case Animalese is still playing, stop that sound as well
        this.animalAudioObject.pause();

        // Play Animal Crossing Wapow sound
        Util.playSound(NookVoice.wapowSound);

        // Unmute microphone input
        app.obs.unmuteMic();

        // Remove HTML divs
        this.removeAnimalCrossingDivs();

        // Clear text queues, but MOVE THIS LATER TO BE VOICE CLASS-WIDE
        this.textQueue = null;
        this.textToBeSpokenQueue = null;

        // Reset all variables for subsequent redeems
        this.currentPhrase = null;
        this.currentWord = null;
        this.isMakingAnimalese = false;
    }

    public async updateTimer(): Promise<void> {
        // Get timer box's text div
        const acTimerTextDiv = document.getElementById("abinal-timer-text");
        if (acTimerTextDiv !== null) {
            acTimerTextDiv.innerHTML = this.remainingTimeString;
        }
    }

    public async displayText(text: string): Promise<void> {
        // Break up input text from newly spoken phrase into array of words and add to containing script array
        if (this.currentPhrase === undefined || this.currentPhrase.length <= 0) {
            this.currentPhrase = text.split(" ");
            this.charDisplayLooper();
        } else {
            this.currentPhrase = this.currentPhrase.concat(text.split(" "));
        }
    }

    private async charDisplayLooper(): Promise<void> {
        // If there are any letters left to be displayed in span
        if (this.currentWord !== undefined && this.currentWord.length > 0) {
            // Shift off front letter from current word and add it to the text span
            const acTextSpan = document.getElementById("abinal-text");
            // That is, assuming the text span is still present in the DOM
            if (acTextSpan !== null) {
                acTextSpan.textContent += this.currentWord.shift();
            }
        // Otherwise, set a new currentWord by shifting off the front of the currentPhrase array
        } else if (this.currentPhrase !== undefined && this.currentPhrase.length > 0) {
            this.currentWord = (this.currentPhrase.shift() + " ").split("");
            if (this.textToBeSpokenQueue !== null) {
                this.textToBeSpokenQueue.push(this.currentWord.join(""));
            }
            if (this.isMakingAnimalese === false) {
                this.makeAnimalese();
            }
        } else {
            return;
        }
        setTimeout(() => { this.charDisplayLooper(); }, 70);
    }

    private async makeAnimalese(): Promise<void> {
        if (this.isMakingAnimalese === true || this.textToBeSpokenQueue === undefined || this.textToBeSpokenQueue.length <= 0) {
            return;
        }

        this.isMakingAnimalese = true;

        // Determine potential pitch change from default
        const chanceToChangePitch: number = 25;
        const minimumPitchValue: number = 0.25;
        const maximumPitchValue: number = 2.0;
        let pitch: number = 1.0;

        const rollToChangePitch: number = Util.Numbers.getRandomIntegerInclusive(1, 100);
        if (rollToChangePitch <= chanceToChangePitch) {
            const randomPitchValue: number = Util.Numbers.getRandomIntegerInclusive(minimumPitchValue * 100, maximumPitchValue * 100);
            pitch = randomPitchValue / 100;
            Logger.noise("Chance pitch value: " + pitch);
        }

        const textToBeSpokenString: string = this.textToBeSpokenQueue.shift();

        // Create Animalese audio blob from given text and pitch value and play it
        this.animalAudioObject.src = this.animalizer.Animalese(textToBeSpokenString, false, pitch).dataURI;
        this.animalAudioObject.play();
        this.animalAudioObject.addEventListener("ended", () => {
            this.isMakingAnimalese = false;
            this.makeAnimalese();
        });
    }

    private async createAnimalCrossingDivs() {
        const acVideo = Object.assign(document.createElement("video"), {id: "abinal-video", className: "abinal-grow"});
        acVideo.src = NookVoice.acVideoFile;
        acVideo.autoplay = true;
        acVideo.loop = true;
        
        // Create the div that contains the text box and set id
        const acTextDiv = Object.assign(document.createElement("div"), {id: "abinal-text-box"});
        
        // Create span that contains the actual text to be put inside the text box div and set id
        const acTextSpan = Object.assign(document.createElement("span"), {id: "abinal-text"});
        
        // Create the div that displays the timer and also apply class that makes div grow via CSS animation
        const acTimerBox = Object.assign(document.createElement("div"), {id: "abinal-timer-box", className: "abinal-grow"});
        
        // Create the div that contains the timer text box and set id
        const acTimerTextDiv = Object.assign(document.createElement("div"), {id: "abinal-timer-text"});
        
        // Get main browser source container div, then append all relevant child divs to it
        const fxBox = document.getElementById("fx-box");
        fxBox.appendChild(acVideo);
        acTextDiv.appendChild(acTextSpan);
        fxBox.appendChild(acTextDiv);
        acTimerBox.appendChild(acTimerTextDiv);
        fxBox.appendChild(acTimerBox);
    }

    private async removeAnimalCrossingDivs() {
        // Get main browser source container div and remove the AC text from it
        const fxBox = document.getElementById("fx-box");
        const acTextBox = document.getElementById("abinal-text-box");
        fxBox.removeChild(acTextBox);
        
        // Get containing AC effect box, replace grow class with ghost class
        const acVideo = document.getElementById("abinal-video");
        acVideo.classList.remove("abinal-grow");
        acVideo.classList.add("abinal-ghost");
        
        // Get AC timer box, remove text, then remove grow class and replace with ghost class
        const acTimerBox = document.getElementById("abinal-timer-box");
        acTimerBox.removeChild(acTimerBox.firstChild);
        acTimerBox.classList.remove("abinal-grow");
        acTimerBox.classList.add("abinal-ghost");
        
        // Remove all remaining child elements from main browser source container div 
        setTimeout(function() { 
            while (fxBox.firstChild) {
                fxBox.removeChild(fxBox.firstChild);
            }
        }, 400);
    }

}