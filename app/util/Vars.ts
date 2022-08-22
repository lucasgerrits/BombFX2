import { hostURLs } from '../../data/secrets/urls.js';
import { Util } from './Util.js';

export class Vars {
    public static async get(varName: string): Promise<boolean | string> {
        let url: string = hostURLs.varGet + "?var=" + varName;
        let result: any = await Util.Requests.makeRequest(url);
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
        let value: boolean | string = await Vars.get(varName);
        let num: number = +value;
        if (num === NaN) {
            return "Not a number value";
        }
        let newValue: string = (num + 1).toString();
        await Vars.set(varName, newValue);
        return newValue;
    }

    public static async set(varName: string, value: string): Promise<any> {
        let url: string = hostURLs.varSet + "?var=" + varName + "&val=" + value;
        let result = await Util.Requests.makeRequest(url);
        return result;
    }
}