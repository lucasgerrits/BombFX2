import { Logger } from './Logger.js';
import { secrets } from '../data/secrets/secrets.js';
import { Util } from './Util.js';
import { voices } from '../data/pollyvoices.js';
import type { PollyParams, Voice } from '../types/PollyTypes.js';

declare var AWS: any;

export class TextToSpeech {

    private polly: any;
    private params: PollyParams;
    public speaker: HTMLAudioElement;
    private defaultVoice: string;

    constructor() {
        this.init();
        this.defaultVoice = "Hans";
    }

    private init(): void {
        AWS.config.accessKeyId = secrets.aws.access;
        AWS.config.secretAccessKey = secrets.aws.secret;
        AWS.config.region = secrets.aws.region;

        this.polly = new AWS.Polly();
        this.params = {
            Engine: "standard", // standard | neural
            LanguageCode: "en-US",
            OutputFormat: "mp3", // json | mp3 | ogg_vorbis | pcm
            SampleRate: "24000", // 8000, 16000, 22050 (standard), 24000 (neural)
            Text: "",
            TextType: "text", // ssml | text
            VoiceId: this.defaultVoice
        };
        
        this.speaker = new Audio();

        // Create an audio context and hook up the audio element as the source
        let audioCtx: AudioContext = new AudioContext();
        let source: MediaElementAudioSourceNode = audioCtx.createMediaElementSource(this.speaker);
        
        // Create a gain node
        let gainNode: GainNode = audioCtx.createGain();
        gainNode.gain.value = 2.5; // GAIN VALUE HERE
        source.connect(gainNode);

        // Connect the gain node to an output destination
        gainNode.connect(audioCtx.destination);
    }

    private randomVoice(arr: Array<Voice>): Voice {
        let max: number = arr.length;
        let random = Util.Math.getRandomIntegerInclusive(0, max);
        return arr[random];
    }

    private randomStandardVoice(): Voice  {
        let usableSet = [...voices.both, ...voices.newscaster, ...voices.standard];
        return this.randomVoice(usableSet);
    }

    private randomNewscasterVoice(): Voice { 
        let usableSet = [...voices.newscaster];
        return this.randomVoice(usableSet);
    }

    private randomNeuralVoice(): Voice {
        let usableSet = [...voices.both, ...voices.newscaster, ...voices.neural];
        return this.randomVoice(usableSet);
    }

    private setTextType(text: string): void {
        // Replace all double quotes with single quotes
        //text = text.replace(/"/g, "\"");

        // Check if string contains tags
        if (text.includes("<") && text.includes(">")) {
            // Then is likely SSML, so add formatting
            this.params.TextType = "ssml";
            this.params.Text = "<speak>" + text + "</speak>";
        } else {
            // Plain text message
            this.params.TextType = "text";
            this.params.Text = text;
        }
    }

    private setVoice(text: string, voiceIn: string): void {
        if (text.includes("<amazon:domain name='news'>")) {
            // Newscaster shenanigans override other sets
            Logger.log("Newscaster?");
            this.params.Engine = "neural";
            this.params.VoiceId = this.randomNewscasterVoice().name;
        } else {
            if (voiceIn === "random") {
                this.params.VoiceId = this.randomStandardVoice().name;
            } else {
                this.params.VoiceId = encodeURIComponent(voiceIn);
            }
        }
    }

    public say(text: string, voiceIn: string = this.defaultVoice): void {
        this.params.Engine = "standard"; // Default reset
        this.setTextType(text);
        this.setVoice(text, voiceIn);
        Logger.tts("Voice: " + this.params.VoiceId + ", Text: " + text);
        
        try {
            this.polly.synthesizeSpeech(this.params, 
                (err: { message: any; }, data: { AudioStream: Iterable<number>; }) => {
                    if (err) {
                        //console.log(err, err.stack);
                        throw(err);
                    }
                    else {
                        let uInt8Array: Uint8Array = new Uint8Array(data.AudioStream);
                        let arrayBuffer: ArrayBufferLike = uInt8Array.buffer;
                        let blob: Blob = new Blob([arrayBuffer]);
                        let url = URL.createObjectURL(blob);
                        this.speaker.src = url;
                        this.speaker.play();
                        return;
                    }
                });
        }
        catch (err) {
            throw(err);
        }
    }
}