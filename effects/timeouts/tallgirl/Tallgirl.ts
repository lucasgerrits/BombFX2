import { BombFX } from "../../../app/BombFX.js";
import { Chatbot } from "../../../app/twitch/Chatbot.js";
import { Effect } from "../../../app/Effect.js";
import { EffectQueueName } from "../../../app/EffectQueue.js";
import { Util } from "../../../app/util/Util.js";
import { secrets } from "../../../data/secrets/secrets.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class TallGirl extends Effect
{
    private static readonly filepath: string = "C:\\xampp\\htdocs\\fx2\\effects\\timeouts\\tallgirl\\videos\\";

    private static readonly filenames: Array<string> = [
        "TallGrill.webm",
        "GOTH_MOMMY.webm",
        "Satsuki_1.webm",
        "CL.webm"
    ];

    constructor() {
        super(EffectQueueName.Timeouts);
    }

    public override async start(): Promise<void> {
        const user: string = this.triggerData.user;
        const message: string = this.triggerData.message;
        let steppieTarget: string = message;
        
        // Determine if specific step argument was passed in (by checking for a space lol)
        let whichGirl: number = -1;
        if (message.indexOf(" ") >= 0) {
            const args: Array<string> = message.split(" ");
            whichGirl = parseInt(args[1]) - 1;
            steppieTarget = args[0];
        } else {
            // Determine random tall girl foot filename (as one was not provided)
            whichGirl = Util.Numbers.getRandomIntegerInclusive(0, TallGirl.filenames.length - 1);
        }

        // Timeout user from chat using Kona's account
        //await TallGirl.timeoutFromKonasAccount(steppieTarget);
        await app.twitch.chat.timeoutUser(steppieTarget, 24, "Know your place...");

        // Get timed out user's profile pic's URL
        const url: string = await app.twitch.profilePic(steppieTarget, 600);

        // Set profile pic URL to browser source in Tall Girl scene
        await app.obs.setBrowserURL("Tall Girl User Profile Pic", url);

        // Set filename to media source
        await app.obs.setMediaFile("Tall Girl Step", TallGirl.filepath + TallGirl.filenames[whichGirl]);

        // Show browser source
        const scene: string = "Tall Girls";
        await app.obs.showSource("Tall Girl User Profile Pic", scene);

        // Enable filters to move browser source upwards into scene
        await app.obs.showFilter(scene, "Move Profile Pic Up");
        await Util.sleep(1000);

        // Show tall girl foot media source
        await app.obs.showSource("Tall Girl Step", scene);

        await Util.sleep(120);

        // Enable filter to move browser source back out of view
        await app.obs.showFilter(scene, "Move Profile Pic Squish");
        await Util.sleep(2500);

        // Hide browser source
        await app.obs.hideSource("Tall Girl User Profile Pic", scene);
        await Util.sleep(1000);

        // Reset position and height of browser source
        await app.obs.showFilter(scene, "Move Profile Pic Reset");

        // Hide tall girl foot media source
        await app.obs.hideSource("Tall Girl Step", scene);
    }
}