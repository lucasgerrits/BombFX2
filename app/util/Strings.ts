import { badWords } from "../../data/secrets/badwords.js";

export class Strings {
    
    public static checkAlphanumeric(str: string): boolean {
        const regex: RegExp = /^[a-zA-Z0-9\s]*$/g;
        return regex.test(str);
    }

    public static containsBadWords(str: string): boolean {
        return badWords.some(word => str.includes(word));
    }

    public static removeCommandPrefix(str: string): string {
        if (str.charAt(0) === "!") {
            str = str.substring(1);
        }
        return str;
    }

    public static removeNonAlphaNumeric(str: string): string {
        return str.replace(/[^a-zA-Z0-9 ]/g, "");
    }

    public static removeNonASCII(str: string): string {
        // eslint-disable-next-line no-control-regex
        const regex: RegExp = /[^\x00-\x7F]/g;
        return str.replace(regex, "");
    }

    public static removeWhiteSpace(str: string): string {
        return str.replace(/\s/g, "");
    }
    
    public static possibleCombinations(str: string): Set<string> {
        const result: Set<string> = new Set<string>();
        str = Strings.removeNonAlphaNumeric(str);
        const strArr: Array<string> = str.split(/\s+/);
        for (let i: number = 0; i < strArr.length; i++) {
            for (let j: number = 0; j <= i; j++) {
                result.add(strArr.slice(j, strArr.length - i + j).join(" "));
            }
        }
        return result;
    }

    public static titleCase(str: string): string {
        // To Title Case © 2018 David Gouch | https://github.com/gouch/to-title-case
        const smallWords: RegExp = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i ;
        const alphanumericPattern: RegExp = /([A-Za-z0-9\u00C0-\u00FF])/ ;
        const wordSeparators: RegExp = /([ :–—-])/ ;

        return str.split(wordSeparators).map((current: string, index: number, array: Array<string>) => {
            if (
                // Check for small words
                current.search(smallWords) > -1 &&
                // Skip first and last word
                index !== 0 && index !== array.length - 1 &&
                // Ignore title end and subtitle start
                array[index - 3] !== ":" && array[index + 1] !== ":" &&
                // Ignore small words that start a hyphenated phrase
                (array[index + 1] !== "-" || (array[index + 1] === "-" && array[index + 1] === "-"))
            ) {
                return current.toLowerCase();
            }

            // Ignore intentional capitalization
            if (current.substring(1).search(/[A-Z]|\../) > -1) {
                return current;
            }

            // Ignore URLs
            if (array[index + 1] === ":" && array[index + 2] !== "") {
                return current;
            }

            // Capitalize the first letter
            return current.replace(alphanumericPattern, (match: string) => {
                return match.toUpperCase();
            });
        }).join("");
    }
}