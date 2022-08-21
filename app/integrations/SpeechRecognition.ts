import { Logger } from '../Logger.js';
import { secrets } from '../../data/secrets/secrets.js';
import { Util } from '../Util.js';

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
                }
            }
            else if (event.result.reason == SpeechSDK.ResultReason.NoMatch) {
                //Logger.noise("NOMATCH: Speech could not be recognized.");
            }
        }

        this.recognizer.recognizing = (sender: any, event: any) => {
            //Logger.noise("RECOGNIZING: " + event.result.text);
        }

        this.recognizer.canceled = (sender: any, event: any) => {
            Logger.noise("CANCELLED: " + event.reason);
        }
    }

    public async start(): Promise<void> {
        Logger.speech("Continuous recognition starting");
        this.textQueue = new Array<string>();
        this.recognizer.startContinuousRecognitionAsync();
    }

    public async stop(): Promise<void> {
        Logger.speech("Continuous recognition stopping");
        this.recognizer.stopContinuousRecognitionAsync();
        this.recognizer.close();
        console.log(this.textQueue);
        this.textQueue = null;
    }
}