import { BombFX } from '../BombFX.js';
import { Logger } from '../Logger.js';
import { Util } from '../Util.js';
import { secrets } from '../../data/secrets/secrets.js';
import { streamerBotTriggers } from '../../data/streamerBotTriggers.js';

declare var app: BombFX;

export class StreamerBotSocket {

    private socket: WebSocket;
    private triggerMap: Map<string, () => Promise<void>>;

    constructor() {
        let address: string = secrets.sbotSocket.address;
        let port: string = secrets.sbotSocket.port;
        let endpoint: string = secrets.sbotSocket.endpoint;

        let fullAddress: string = "ws://" + address + ":" + port + "/" + endpoint;
        this.socket = new WebSocket(fullAddress);
        this.fillMap();
        this.setEventHandlers();
    }

    private fillMap() {
        this.triggerMap = new Map<string, () => Promise<void>>(
            streamerBotTriggers.map(t => [t.name, t.action])
        );
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
            Logger.sbot("Socket error");
        }

        this.socket.onmessage = (event): void => {
            let data = JSON.parse(event.data);

            // Fix any weird naming structure
            if (data.hasOwnProperty("data")) { data = data.data; }

            // Was message type specified
            if (data.hasOwnProperty("name")) {
                //console.log(data);
                let name = data.name;

                // Function request FROM a Streamer.bot Action
                if (this.triggerMap.has(name)) {
                    let action: Function = this.triggerMap.get(name);
                    action(data);
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
        let json: string = JSON.stringify(
            {
                "request": "DoAction",
                "action": {
                    "name": "" + action
                },
                "args": args,
                "id": "" + this.createID()
            }
        );
        this.socket.send(json);
    }

    private createID(): number {
        return Util.Math.getRandomIntegerInclusive(1, 10000);
    }
}