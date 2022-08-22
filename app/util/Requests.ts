import { BombFX } from '../BombFX.js';
import { Logger } from '../Logger.js';
import { webhookURLs } from '../../data/secrets/urls.js';

declare var app: BombFX;

export class Requests {
    public static base64ToBlob(b64Data: string, contentType: string, sliceSize: number = 512): Blob {
        contentType = contentType || '';
    
        let byteCharacters: string = atob(b64Data);
        let byteArrays = new Array<Uint8Array>();
    
        for (let offset: number = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice: string = byteCharacters.slice(offset, offset + sliceSize);
    
            let byteNumbers = new Array<number>(slice.length);
            for (let i: number = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
    
            var byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
    
        let blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }

    public static async makeRequest(url: string, method: string = "GET", body?: string): Promise<any> {
        // Create the XHR request
        var request = new XMLHttpRequest();
        // Return it as a Promise
        return new Promise(function (resolve, reject) {
            // Setup our listener to process compeleted requests
            request.onreadystatechange = function () {
                
                // Only run if the request is complete
                if (request.readyState !== 4) return;
                // Process the response
                if (request.status >= 200 && request.status < 300) {
                    // If successful
                    resolve(request);
                } else {
                    // If failed
                    reject({
                        status: request.status,
                        statusText: request.statusText
                    });
                }
            };

            // Setup our HTTP request
            request.open(method, url, true);
            request.setRequestHeader("Content-Type", "application/json");
            // Send the request
            if (method === "POST") {
                request.send(body);
            } else {
                request.send();
            }
        });
    };

    public static async chatWebhook(str: string, timestamp: string, message: string = "", 
        user: string = "MilkBarkeep", webhookURL: string = null) {
        
        let naughtyUsers: Array<string> = [ ];
        if (naughtyUsers.includes(user)) {
            app.twitch.bot.say("Unable to post reminder, user is on 'the naughty list'.");
            return;
        }

        let dateObj: Date = new Date(parseInt(timestamp) * 1);
        let time: string = dateObj.toLocaleTimeString('en-US');
        let date: string = dateObj.toDateString();

        if (str.includes("@user")) { str = str.replace("@user", user); }
        if (str.includes("@time")) { str = str.replace("@time", time); }
        if (str.includes("@date")) { str = str.replace("@date", date); }
        if (str.includes("@message")) { str = str.replace("@message", message); }

        Requests.webhook(str, webhookURL);
    }

    public static async webhook(str: string, webhookURL: string = null) {
        let debug: boolean = false;

        if (debug || webhookURL == null) { // secret -> testing
            webhookURL = webhookURLs.testing;
        }

        //let avatarURL: string = await Twitch.profilePic(user);
        //username: user,
        //avatar_url: avatarURL,

        let postData: { } = {
            content: str
        };

        let request: XMLHttpRequest = new XMLHttpRequest();
        request.onload = function (): void {
            // HTTP response status, e.g., 200 for "200 OK"
            let status: number = request.status;
            let statusText: string = request.statusText;
            let statusStr: string = "Webhook HTTP response status: " + status;
            if (statusText !== "") {
                statusStr += " - " + statusText;
            }

            // Returned data, e.g., an HTML document.
            //let data: string = request.responseText; 
            
            Logger.noise(statusStr);
            if (status >= 200 && status < 300) {
                app.twitch.bot.say("Successfully posted to Discord.");
            } else {
                app.twitch.bot.say("There was an issue with posting to Discord.");
            }
        }
        request.open("POST", webhookURL, true);
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        request.send(JSON.stringify(postData));
    }
}