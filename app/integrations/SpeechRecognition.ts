import { Logger } from "../Logger.js";
import { secrets } from "../../data/secrets/secrets.js";

// eslint-disable-next-line no-var
declare var SpeechSDK: any;

export class SpeechRecognition {
    private recognizedLanguage: string = "en-us";
    private profanityLevel: number = 2; // 0 - masked, 1 - removed, 2 - raw
    private speechConfig: any;

    private audioConfig: any;
    private recognizer: any;

    public textQueue: Array<string>;

    constructor() {
        this.speechConfig = SpeechSDK.SpeechConfig.fromSubscription(
            secrets.azure.subscriptionKey, secrets.azure.serviceRegion);
        this.speechConfig.speechRecognitionLanguage = this.recognizedLanguage;
        this.speechConfig.setProfanity(this.profanityLevel);

        this.audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        this.recognizer = new SpeechSDK.SpeechRecognizer(this.speechConfig, this.audioConfig);

        this.setEventHandlers();
    }

    private async setEventHandlers(): Promise<void> {
        this.recognizer.recognized = (sender: any, event: any) => {
            if (event.result.reason == SpeechSDK.ResultReason.RecognizedSpeech) {
                const transcript: string = event.result.text;
                if (transcript !== undefined || transcript !== "") {
                    Logger.noise("RECOGNIZED: " + transcript);
                    this.textQueue.push(transcript);

                    const evt = new CustomEvent("RecognizedSpeechText", { bubbles: true, detail: transcript });
                    window.dispatchEvent(evt);
                }
            }
            else if (event.result.reason == SpeechSDK.ResultReason.NoMatch) {
                //Logger.noise("NOMATCH: Speech could not be recognized.");
            }
        };

        this.recognizer.recognizing = (sender: any, event: any) => {
            //Logger.noise("RECOGNIZING: " + event.result.text);
        };

        this.recognizer.canceled = (sender: any, event: any) => {
            Logger.noise("CANCELLED: " + event.reason);
        };
    }

    public async startRecognition(): Promise<void> {
        this.textQueue = new Array<string>();
        this.recognizer.startContinuousRecognitionAsync();
        Logger.speech("Continuous recognition started");
    }

    public async stopRecognition(): Promise<void> {
        this.recognizer.stopContinuousRecognitionAsync();
        //this.recognizer.close();
        this.textQueue = null;
        Logger.speech("Continuous recognition stopped");
    }
}