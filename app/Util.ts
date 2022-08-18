import { BombFX } from './BombFX.js';
import { Logger } from './Logger.js';
import { badWords } from '../data/secrets/badwords.js';
import { hostURLs, webhookURLs } from '../data/secrets/urls.js';

declare var app: BombFX;

export class Util {

    public static playSound(filename: string, volumeIn: number = 1.0): void {
        let sound = new Audio();
        sound.src = filename;
        sound.volume = volumeIn;
        sound.play();
    }

    public static async playSoundForDuration(filename: string, durationInMS: number) {
        let sound = new Audio();
        sound.src = filename;
        sound.play();
        await Util.sleep(durationInMS);
        sound.pause();
    }
    
    public static sleepInSeconds(seconds: number): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    public static sleep(ms: number): Promise<any> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static typeCheck(variable: object) {
        const varToString: Function = (varObj: Object) => Object.keys(varObj)[0];
        let varName: string = varToString(variable);
        let varType: string = typeof (variable as any)[varName];
        console.log(varName + " is of type " + varType);
    }
 
    public static wrapFn(fn: Function, context: unknown, params: Array<any>): Function {
        return function () {
            fn.apply(context, params);
        }
    }

    public static activator<T extends object>(type: { new(): T ;} ): T {
        return new type();
    }

    public static Color = class {

        public static hexToInt(hex: string): number {
            let rgb: Array<number> = Util.Color.hexToRGB(hex);
            let int: number = Util.Color.rgbToInt(rgb[0], rgb[1], rgb[2]);
            return int;
        }

        public static hexToRGB(hex: string): Array<number> {
            let chunks: Array<number> = new Array<number>();
            let tmp: any;

            // Check if hex prefixed with #
            let c: number = hex.search("#");
            if (c != -1) {
                hex = hex.substr(1);
            }

            // Determine length of hex (3 vs 6)
            if (hex.length === 3) {
                tmp = hex.split("");
                for (let i: number = 0; i < 3; i++) {
                    chunks.push(parseInt(tmp[i] + "" + tmp[i], 16));
                }
            } else if (hex.length === 6) {
                tmp = hex.match(/.{2}/g);
                for (let i: number = 0; i < 3; i++) {
                    chunks.push(parseInt((tmp[i] as string), 16));
                }
            } else {
                chunks = [-1, -1, -1]
            }
 
            return chunks;
        }

        public static rgbToInt(red: number, green: number, blue: number): number {
            const r: number = red & 0xFF;
            const g: number = green & 0xFF;
            const b: number = blue & 0xFF;
            let rgb = (r) + (g << 8) + (b << 16);
            rgb = rgb + 4278190080;
            return rgb;
        }
    }

    public static Math = class {

        public static getRandomIntegerInclusive(min: number, max: number): number {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min); // Min and max are inclusive
        }
        
        public static msToMinSec(ms: number): string {
            let minutes: number = Math.floor(ms / 60000);
            let seconds: number = Math.floor((ms / 1000) - (minutes * 60));
            //return "hi";
            return minutes.toString().padStart(2, "0") + " minutes " +
                seconds.toString().padStart(2, "0") + " seconds";
        }
    }

    public static String = class {
        
        public static checkAlphanumeric(str: string): boolean {
            let regex: RegExp = /^[a-zA-Z0-9\s]*$/g;
            return regex.test(str);
        }

        public static containsBadWords(str: string): boolean {
            return badWords.some(word => str.includes(word));
        }

        public static removeCommandPrefix(str: string): string {
            if (str.charAt(0) === '!') {
                str = str.substring(1);
            }
            return str;
        }

        public static removeNonAlphaNumeric(str: string): string {
            return str.replace(/[^a-zA-Z0-9 ]/g, "");
        }

        public static removeNonASCII(str: string): string {
            return str.replace(/[^\x00-\x7F]/g, "");
        }

        public static removeWhiteSpace(str: string): string {
            return str.replace(/\s/g, '');
        }
        
        public static possibleCombinations(str: string): Set<string> {
            let result: Set<string> = new Set<string>();
            str = Util.String.removeNonAlphaNumeric(str);
            let strArr: Array<string> = str.split(/\s+/);
            for (let i: number = 0; i < strArr.length; i++) {
                for (let j: number = 0; j <= i; j++) {
                    result.add(strArr.slice(j, strArr.length - i + j).join(' '));
                }
            }
            return result;
        }

        public static titleCase(str: string): string {
            // To Title Case © 2018 David Gouch | https://github.com/gouch/to-title-case
            let smallWords: RegExp = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i ;
            let alphanumericPattern: RegExp = /([A-Za-z0-9\u00C0-\u00FF])/ ;
            let wordSeparators: RegExp = /([ :–—-])/ ;

            return str.split(wordSeparators).map((current: string, index: number, array: Array<string>) => {
                if (
                    // Check for small words
                    current.search(smallWords) > -1 &&
                    // Skip first and last word
                    index !== 0 && index !== array.length - 1 &&
                    // Ignore title end and subtitle start
                    array[index - 3] !== ':' && array[index + 1] !== ':' &&
                    // Ignore small words that start a hyphenated phrase
                    (array[index + 1] !== '-' || (array[index + 1] === '-' && array[index + 1] === '-'))
                ) {
                    return current.toLowerCase();
                }

                // Ignore intentional capitalization
                if (current.substring(1).search(/[A-Z]|\../) > -1) {
                    return current;
                }

                // Ignore URLs
                if (array[index + 1] === ':' && array[index + 2] !== '') {
                    return current;
                }

                // Capitalize the first letter
                return current.replace(alphanumericPattern, (match: string) => {
                    return match.toUpperCase();
                })
            }).join('');
        }
    }

    public static Time = class {
        public static hoursToMS(hours: number): number {
            return hours * (60 * (60 * 1000));
        }

        public static minToMS(minutes: number): number {
            return minutes * (60 * 1000);
        }

        public static secToMS(seconds: number): number {
            return seconds * 1000;
        }

        public static secToHMS(seconds: number): string {
            return new Date(seconds * 1000).toISOString().slice(11, 19);
        }
    }

    public static Vars = class {

        public static async get(varName: string): Promise<boolean | string> {
            let url: string = hostURLs.varGet + "?var=" + varName;
            let result: any = await Util.Web.makeRequest(url);
            let value: string = result.response;
            // Converting truthy string into bool
            if (value == "true") {
                return true;
            } else if (value == "false") {
                return false;
            } else {
                return value;
            }
        }

        public static async increment(varName: string): Promise<string> {
            let value: boolean | string = await Util.Vars.get(varName);
            let num: number = +value;
            if (num === NaN) {
                return "Not a number value";
            }
            let newValue: string = (num + 1).toString();
            await Util.Vars.set(varName, newValue);
            return newValue;
        }

        public static async set(varName: string, value: string): Promise<any> {
            let url: string = hostURLs.varSet + "?var=" + varName + "&val=" + value;
            let result = await Util.Web.makeRequest(url);
            return result;
        }
    }

    public static Web = class {
        
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

            Util.Web.webhook(str, webhookURL);
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


}