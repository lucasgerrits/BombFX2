import { BombFX } from "../../../app/BombFX.js";
import { Chatbot } from "../../../app/twitch/Chatbot.js";
import { Util } from "../../../app/util/Util.js";
import { secrets } from "../../../data/secrets/secrets.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class TallGirl
{
    private static readonly filepath: string = "C:\\xampp\\htdocs\\fx2\\effects\\timeouts\\tallgirl\\videos\\";

    private static readonly filenames: Array<string> = [
        "TallGrill.webm",
        "GOTH_MOMMY.webm",
        "Satsuki_1.webm",
        "CL.webm"
    ];

    public static async step(username: string, whichGirl: number = -1): Promise<void> {
        // Timeout user from chat using Kona's account
        await TallGirl.timeout(username);

        // Get timed out user's profile pic's URL
        const url: string = await app.twitch.profilePic(username, 600);

        // Set profile pic URL to browser source in Tall Girl scene
        await app.obs.setBrowserURL("Tall Girl User Profile Pic", url);

        // Determine random tall girl foot filename (if one was not provided) then set to media source\
        whichGirl--;
        if (whichGirl < 0) {
            whichGirl = Util.Numbers.getRandomIntegerInclusive(0, TallGirl.filenames.length - 1);
        }
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

    private static async timeout(username: string): Promise<void> {
        let konaAccount: Chatbot = new Chatbot(secrets.kona.name, secrets.kona.oauth);
        await konaAccount.connect();
        const twentyFour: number = 24;
        const reason: string = "Know your place...";
        konaAccount.say("/timeout " + username + " " + twentyFour + " " + reason, true);
        konaAccount.disconnect();
        konaAccount = null;
    }
}