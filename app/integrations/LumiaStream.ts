import { lightIDs } from "../../data/secrets/lightIDs.js";
import { secrets } from "../../data/secrets/secrets.js";
import { Logger } from "../Logger.js";
import { Util } from "../util/Util.js";

export class LumiaStream {
    private token: string;
    private port: string;
    private socket: WebSocket;

    constructor() {
        this.token = secrets.lumia.apiKey;
        this.port = secrets.lumia.port;

        const fullAddress: string = "ws://localhost:" + this.port + "/api?token=" + this.token;
        this.socket = new WebSocket(fullAddress);

        this.socket.onopen = (): void => {
            Logger.lumia("WebSocket connection opened");
        };
    }

    public async getLights() {
        const url: string = "http://localhost:" + this.port + "/api/retrieve?token=" + this.token;
        const result: any = await Util.Requests.makeRequest(url);
        const lightArr = JSON.parse(result.response).data.lights;
        console.log(lightArr);
    }

    public sendHex(hexValue: string) {
        this.socket.send(JSON.stringify(
            {
                "type": "hex-color",
                "params": {
                    "value": hexValue,
                    "brightness": 100,
                    "transition": 0,
                    "duration": 0
                },
                "lights": [
                    { "type": lightIDs.lampBulb.type, "value": lightIDs.lampBulb.id }
                ]
            }
        ));
    }

    public sendRGB(rgbArr: Array<number>) {
        this.socket.send(JSON.stringify(
            {
                "type": "rgb-color",
                "params": {
                    "value": {
                        "r": rgbArr[0],
                        "g": rgbArr[1],
                        "b": rgbArr[2]
                    }, // ct range: [2000, 7000]
                    "brightness": 100,
                    "transition": 0,
                    "duration": 0
                },
                "lights": [
                    { "type": lightIDs.lampBulb.type, "value": lightIDs.lampBulb.id }
                ]
            }
        ));
    }

}