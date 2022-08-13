import { greetings } from "../../data/greetings.js";

export class GreetingMap {

    private map: Map<string, () => Promise<void>>;
    
    constructor() {
        this.map = new Map<string, () => Promise<void>>(
            greetings.map(g => [g.user, g.action])
        );
    }

    public has(key: string): boolean {
        return this.map.has(key);
    }

    public get(key: string): Function | undefined {
        return this.map.get(key);
    }
}