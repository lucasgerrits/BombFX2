import { Logger } from '../Logger.js';
import { secrets } from '../../data/secrets/secrets.js';
import { Util } from '../util/Util.js';

declare var tmi: any;

export class Chatbot {

    private client: any;

    constructor(usernameIn: string = secrets.bot.name, passwordIn: string = secrets.bot.oauth) {
        this.client = new tmi.Client({
            options: {
                debug: false,
                skipUpdatingEmotesets: true,
                updateEmotesetsTimer: 0
            },
            identity: {
                username: usernameIn,
                password: passwordIn
            },
            channels: [ secrets.channel ]
        });

        this.client.connect();
    }

    public say(msgIn: string, actionOverride: boolean = false): void {
        let msg: string = "";
        if (actionOverride) {
            msg = msgIn;
        } else {
            msg = "/me : " + msgIn;
        }
        //this.setColor();
        Logger.bot(msg);
        this.client.say(secrets.channel, msg);
    }

    public announce(msgIn: string): void {
        this.say("/announce " + msgIn, true);
    }

    public setColor(newColor: string = "Random"): void {
        let available: Array<string> = [
            "Red", "Blue", "Green", "Firebrick", "Coral", "Goldenrod",
            "BlueViolet", "Chocolate", "CadetBlue", "YellowGreen",
            "SeaGreen", "DodgerBlue", "SpringGreen", "OrangeRed", "HotPink"
        ];

        if (newColor === "Random") {
            let rand: number = Util.Numbers.getRandomIntegerInclusive(0, available.length);
            newColor = available[rand];
        }

        let msg: string = "/color " + newColor;
        this.say(msg, true);
    }

    public async relay(url: string): Promise<any> {
        let result = await Util.Requests.makeRequest(url, "GET");
        console.log(result.response);
        if (result.response !== " ") {
            this.say(result.response);
        }
    }
}