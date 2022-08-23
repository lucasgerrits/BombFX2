import { Colors } from "./Colors.js";
import { Numbers } from "./Numbers.js";
import { Requests } from "./Requests.js";
import { Strings } from "./Strings.js";
import { Vars } from "./Vars.js";

export class Util {

    public static playSound(filename: string, volumeIn: number = 1.0): void {
        const sound = new Audio();
        sound.src = filename;
        sound.volume = volumeIn;
        sound.play();
    }

    public static async playSoundForDuration(filename: string, durationInMS: number) {
        const sound = new Audio();
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
        const varToString: (varObj: unknown) => string = (varObj: unknown) => Object.keys(varObj)[0];
        const varName: string = varToString(variable);
        const varType: string = typeof (variable as any)[varName];
        console.log(varName + " is of type " + varType);
    }
 
    public static wrapFn(fn: () => unknown, context: unknown, params: []): () => unknown {
        return function () {
            fn.apply(context, params);
        };
    }

    public static activator<T extends object>(type: { new(): T ;} ): T {
        return new type();
    }

    public static Colors = Colors;

    public static Numbers = Numbers;

    public static Requests = Requests;

    public static Strings = Strings;

    public static Vars = Vars;
    
}