import { BombFX } from '../../app/BombFX.js';
import { Effect } from '../../app/Effect.js';
import { EffectQueueName } from '../../app/EffectQueue.js';
import { Reward } from '../../app/twitch/Reward.js';
import { Util } from '../../app/Util.js';

declare var app: BombFX;

export class BattletoadsReward extends Reward {
    public static override id: string = "0e7ab4e5-9df3-48e1-b7fd-18203623b712";
    public static override title: string = "Battletoads???";
    public static override cost: number = 300;
    
    constructor() {
        super(BattletoadsReward.id, BattletoadsReward.title, new Battletoads());
        this.allowedOnBRB = true;
    }
}

export class Battletoads extends Effect {
    constructor() {
        super(EffectQueueName.Toads);
    }
    
    public override async start(): Promise<void> {
        app.obs.showSource("Battletoads Pause Jam", "** Mega Overlay");
        
        app.obs.muteMic();
        app.obs.muteDesktop();

        let currentScene: string = await app.obs.getCurrentSceneName();
        
        app.obs.send("AddFilterToSource", {
            "sourceName" : currentScene,
            "filterName" : "Battletoads Freeze",
            "filterType" : "freeze_filter",
            "filterSettings" : { }
        });
            
        await Util.sleep(8100);

        app.obs.send('RemoveFilterFromSource', {
            sourceName : currentScene,
            filterName : "Battletoads Freeze"
        });

        app.obs.unmuteMic();
        app.obs.unmuteDesktop();
        
        app.obs.hideSource("Battletoads Pause Jam", "** Mega Overlay");
    }
}
