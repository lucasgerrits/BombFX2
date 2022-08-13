import { BombFX } from '../BombFX.js';
import { Reward } from './Reward.js';
import { rewardsList } from '../../data/rewardsList.js';

declare var app: BombFX;

export class RewardMap {
    
    private map: Map<string, Reward>;

    constructor() {
        this.map = new Map<string, Reward>(
            rewardsList.map(r => [r.key, r.value])
        );
    }

    public set(keyIn: string, valueIn: Reward): void {
        this.map.set(keyIn, valueIn);
    }

    public has(key: string): boolean {
        return this.map.has(key);
    }

    public get(key: string): Reward | undefined {
        return this.map.get(key);
    }

    public async pauseAll(): Promise<void> {
        app.twitch.bot.say("Pausing all channel point rewards.");
        this.map.forEach(async (value, key) => {
            value.pause();
        });
    }

    public async resumeAll(): Promise<void> {
        app.twitch.bot.say("Unpausing all channel point rewards.");
        this.map.forEach(async (value, key) => {
            value.resume();
        });
    }
}