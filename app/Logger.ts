export class Logger {
    private static readonly DEBUG = true;
    
    public static log(strIn: string, styleIn: Array<string> | string = "color: #FFFFFF"): void {
        if (Logger.DEBUG === true) {
            // Get current local time and append to input string
            const today : Date = new Date();
            const ms: string = today.getMilliseconds().toString().padStart(3, "0");
            const time: string = today.toLocaleTimeString();
            const timeStr: string = time.substring(0, time.length - 3) + "." + ms + time.substring(time.length - 3);
            const logStr: string = "%c[" + timeStr + "]%c " + strIn;

            // Create styles arr with timer style string
            const timerStyle: string = "background-color: #111111; color: #9ACD32";
            const styles: Array<string> = new Array(timerStyle);

            // Append arguments based on type
            if (typeof styleIn === "string") {
                styles.push(styleIn);
            } else {
                styles.push(...styleIn);
            }

            // Output final result to console
            console.log(logStr, ...styles);
        }
    }
    
    public static bomb(str: string, style: string = "color: #DD0012") {
        Logger.log(str, style);
    }

    public static bot(str: string, style: string = "color: #9ACD32") {
        Logger.log("[Barkeep] " + str, style);
    }

    public static error(str: string, style: string = "color: #DD0012"): void {
        Logger.log("[Error] " + str, style);
    }

    public static heat(str: string, style: string = "color: orange"): void {
        Logger.log("[Heat] " + str, style);
    }

    public static noise(str: string, style: string = "color: #777777; font-style: italic;"): void {
        Logger.log(str, style);
    }

    public static obs(str: string, style: string = "color: #0C1633; font-weight: bold"): void {
        Logger.log("[OBS WebSocket] " + str, style);
    }

    public static sbot(str: string, style: string = "color: #00DBFF"): void {
        Logger.log("[Streamer.bot] " + str, style);
    }

    public static speech(str: string, style: string = "color: #0080FF"): void {
        Logger.log("[Azure] " + str, style);
    }

    public static tts(str: string, style: string = "color: #FF9900"): void {
        Logger.log("[Polly] " + str, style);
    }
    
    public static twitch(str: string, style: string = "color: #9246FF"): void {
        Logger.log("[Twitch] " + str, style);
    }
}