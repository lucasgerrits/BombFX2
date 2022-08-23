import { ChatTrigger } from "./ChatTrigger.js";
import { triggerList } from "../../data/triggerList.js";

export class TriggerMap {

    private aliases: Map<string, string>;
    private map: Map<string, ChatTrigger>;

    constructor() {
        this.aliases = new Map<string, string>();
        this.map = new Map<string, ChatTrigger>();
        this.fillMaps();
    }

    private fillMaps(): void {
        // For each chat trigger (command or otherwise) in array
        for (let currentTrigger: number = 0; currentTrigger < triggerList.length; currentTrigger++) {
            // Add trigger string key and data value to base map
            const trigObj: ChatTrigger = new ChatTrigger(triggerList[currentTrigger]);
            this.map.set(triggerList[currentTrigger].trigger, trigObj);
            // If any aliases are listed in data:
            if (triggerList[currentTrigger].aliases) {
                // For each aliases present, add alias string key and trigger string value to alias map
                for (let currentAlias: number = 0; currentAlias < triggerList[currentTrigger].aliases.length; currentAlias++) {
                    this.aliases.set(triggerList[currentTrigger].aliases[currentAlias], triggerList[currentTrigger].trigger);
                }
            }
        }
    }

    public has(key: string): boolean {
        return this.map.has(key) || this.aliases.has(key);
    }

    public get(key: string): ChatTrigger | undefined {
        if (this.aliases.has(key)) {
            key = this.aliases.get(key);
        }
        return this.map.get(key);
    }

    public hasWhich(keysIn: Set<string>): Set<string> {
        const possibleTriggers: Array<string> = Array.from([...this.map.keys(), ...this.aliases.keys()]);
        const toCheck: Array<string> = Array.from(keysIn);
        const intersection: Array<string> = toCheck.filter(element => possibleTriggers.indexOf(element) !== -1);
        const setFromArr: Set<string> = new Set<string>(intersection);
        return setFromArr;
    }
}