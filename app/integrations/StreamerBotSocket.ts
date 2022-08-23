import { BombFX } from "../BombFX.js";
import { Logger } from "../Logger.js";
import { Util } from "../util/Util.js";
import { secrets } from "../../data/secrets/secrets.js";
import { streamerBotTriggers } from "../../data/streamerBotTriggers.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class StreamerBotSocket {

    private socket: WebSocket;
    private triggerMap: Map<string, () => Promise<void>>;

    constructor() {
        const address: string = secrets.sbotSocket.address;
        const port: string = secrets.sbotSocket.port;
        const endpoint: string = secrets.sbotSocket.endpoint;

        const fullAddress: string = "ws://" + address + ":" + port + "/" + endpoint;
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
        };

        this.socket.onclose = (): void => {
            Logger.sbot("WebSocket connection closed");
        };

        this.socket.onerror = (event): void => {
            Logger.sbot("Socket error");
        };

        this.socket.onmessage = (event): void => {
            let data = JSON.parse(event.data);

            // Fix any weird naming structure
            if (Object.prototype.hasOwnProperty.call(data, "data")) { data = data.data; }

            // Was message type specified // name
            if (Object.prototype.hasOwnProperty.call(data, "name")) {
                //console.log(data);
                const name = data.name;

                // Function request FROM a Streamer.bot Action
                if (this.triggerMap.has(name)) {
                    const action: (arg: unknown) => unknown = this.triggerMap.get(name);
                    action(data);
                }
            }
        };
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
        const action: string = "Voice - " + voice;
        this.doAction(action);
    }

    public async doAction(action: string, args: Record<string, unknown> = { }): Promise<void> {
        const json: string = JSON.stringify(
            {
                "request": "DoAction",
                "action": {
                    "name": "" + action
                },
                "args": args,
                "id": "" + this.createID()
            }
        );
        Logger.sbot("Sending action request");
        this.socket.send(json);
    }

    private createID(): number {
        return Util.Numbers.getRandomIntegerInclusive(1, 10000);
    }
}