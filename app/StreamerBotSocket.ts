import { BombFX } from './BombFX.js';
import { Logger } from './Logger.js';
import { Util } from './Util.js';
import { secrets } from '../data/secrets.js';

declare var app: BombFX;

export class StreamerBotSocket {

    private socket: WebSocket;

    constructor() {
        let address: string = secrets.sbotSocket.address;
        let port: string = secrets.sbotSocket.port;
        let endpoint: string = secrets.sbotSocket.endpoint;

        let fullAddress: string = "ws://" + address + ":" + port + "/" + endpoint;
        this.socket = new WebSocket(fullAddress);
        this.setEventHandlers();
    }

    private setEventHandlers(): void {
        this.socket.onopen = (): void => {
            //"speechToText":["Command","Dictation"]
            //"command":["Message","Whisper"]
            //"websocketCustomServer":["Open","Close","Message"]
            Logger.sbot("WebSocket connection opened");
            this.socket.send(JSON.stringify(
                {
                    "request": "Subscribe",
                    "events": {
                        "general":["Custom"]
                    },
                    "id": "" + this.createID()
                }
            ));
        }

        this.socket.onclose = (): void => {
            Logger.sbot("WebSocket connection closed");
        }

        this.socket.onerror = (event): void => {
            Logger.sbot("Socket error:");
            console.log(event);
        }

        this.socket.onmessage = (event): void => {
            let data = JSON.parse(event.data);

            // Fix any weird naming structure
            if (data.hasOwnProperty("data")) { data = data.data; }

            // Was message type specified
            if (data.hasOwnProperty("type")) {
                //console.log(data);
                let type = data.type;

                // Request for Text-To-Speech
                if (type === "tts") {
                    app.tts.say(data.message);
                // Request to perform some action
                } else if (type === "function") {
                    // Likely needs to be recreated for TS version
                }
            }
        }
    }
    
    public async getEvents(): Promise<void> {
        this.socket.send(JSON.stringify(
            {
                "request": "GetEvents",
                "id": "" + this.createID()
            }
        ));
    }

    public async setVoicemod(voice: string): Promise<void> {
        let action: string = "Voice - " + voice;
        this.doAction(action);
    }

    public async doAction(action: string, args: { } = { }): Promise<void> {
        this.socket.send(JSON.stringify(
            {
                "request": "DoAction",
                "action": {
                    "name": "" + action
                },
                "args": args,
                "id": "" + this.createID()
            }
        ));
    }

    private createID(): number {
        return Util.Math.getRandomIntegerInclusive(1, 10000);
    }
}