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
                if (event.result.text !== undefined || event.result.text !== "") {
                    Logger.noise("RECOGNIZED: " + event.result.text);
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
        this.recognizer.startContinuousRecognitionAsync();
    }

    public async stop(): Promise<void> {
        this.recognizer.stopContinuousRecognitionAsync();
        this.recognizer.close();
    }
}