import { Blank } from '../blank/Blank.js';
import { BombFX } from '../../app/BombFX.js';
import { Reward } from '../../app/twitch/Reward.js';

declare var app: BombFX;

export class ButtsbotWordReward extends Reward {
    public static override id: string = "4c4d7734-a51c-4518-ab2f-649a067c4291";
    public static override title: string = "Change Buttsbot's Word";
    public static override cost: number = 1500;

    constructor() {
        super(ButtsbotWordReward.id, ButtsbotWordReward.title, new Blank());
    }
}

export class CloneHeroRequestReward extends Reward {
    public static override id: string = "4d9eca3c-e5ac-43ec-b9a6-cde9318f153c";
    public static override title: string = "Clone Hero Request";
    public static override cost: number = 2500;

    constructor() {
        super(CloneHeroRequestReward.id, CloneHeroRequestReward.title, new Blank());
    }
}

export class FiveMinPaintReward extends Reward {
    public static override id: string = "2ac432d9-cb7a-475b-9498-1bae5f4f6511";
    public static override title: string = "5 Minute MS Paint";
    public static override cost: number = 5000;

    constructor() {
        super(FiveMinPaintReward.id, FiveMinPaintReward.title, new Blank());
    }
}

export class SubparImpressionReward extends Reward {
    public static override id: string = "f593ba8f-4f0b-4605-bfe3-2416e9effcab";
    public static override title: string = "Subpar Impression (No Song)";
    public static override cost: number = 700;

    constructor() {
        super(SubparImpressionReward.id, SubparImpressionReward.title, new Blank());
    }
}

export class TypeRacerBreakReward extends Reward {
    public static override id: string = "8faea877-a5d2-4e74-941d-f7c2d8601bc8";
    public static override title: string = "TypeRacer Break";
    public static override cost: number = 3000;

    constructor() {
        super(TypeRacerBreakReward.id, TypeRacerBreakReward.title, new Blank());
    }
}