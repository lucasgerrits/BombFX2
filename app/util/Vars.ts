import { hostURLs } from "../../data/secrets/urls.js";
import { Util } from "./Util.js";

export class Vars {
    public static async get(varName: string): Promise<boolean | string> {
        const url: string = hostURLs.varGet + "?var=" + varName;
        const result: any = await Util.Requests.makeRequest(url);
        const value: string = result.response;
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
        const value: boolean | string = await Vars.get(varName);
        const num: number = +value;
        if (isNaN(num)) {
            return "Not a number value";
        }
        const newValue: string = (num + 1).toString();
        await Vars.set(varName, newValue);
        return newValue;
    }

    public static async set(varName: string, value: string): Promise<any> {
        const url: string = hostURLs.varSet + "?var=" + varName + "&val=" + value;
        const result = await Util.Requests.makeRequest(url);
        return result;
    }
}