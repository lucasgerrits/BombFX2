import { BombFX } from '../../../app/BombFX.js';
import { Util } from '../../../app/util/Util.js';
import type { CommandEventData } from '../../../types/ComfyTypes.js';

declare var app: BombFX;

export class Spray {

    public static async bottle(data: CommandEventData): Promise<void> {
        let callingUser: string = data.user;
    
        // Determine command arguments
        let message: string = data.message;
        let firstSpace: number = message.indexOf(" ");
        let targetUser: string = message;
        let reason: string = "";

        // If there was a reason provided for spray
        if (firstSpace !== -1) {
            targetUser = message.substring(0, firstSpace);
            reason = message.substring(firstSpace + 1);
        }

        // Check if target user contained 'at' symbol
        if (targetUser.substring(0,1) === "@") {
            targetUser = targetUser.substring(1);
        }

        let imgURL: string = "";

        // Set and enable proper spray target sources
        if (targetUser === "chat") {
            await app.obs.showSource("Target User Is Chat", "** User Commands");
        } else {
            imgURL = await app.twitch.profilePic(targetUser, 600);

            // If no profile pic URL was returned, target user doesn't exist
            if (imgURL === "") {
                imgURL = await app.twitch.profilePic(callingUser, 600);
                targetUser = callingUser;
                reason = "For entering the wrong username, idiot";
            }

            // Change Twitch profile pic's URL
            await app.obs.setBrowserURL("Target User Profile Picture", imgURL);
        }

        // Set content of text boxes
        await app.obs.setText("Target User Name", targetUser);
        await app.obs.setText("Target User Reason", reason);

        // Show everything
        await app.obs.showSource("** User Commands", "** Mega Overlay");
        await app.obs.showFilter("** User Commands", "Opaque");
        await Util.sleep(3000);

        await app.obs.showFilter("** User Commands", "Transparent");
        await Util.sleep(1000);

        await app.obs.hideSource("** User Commands", "** Mega Overlay");
        await app.obs.hideSource("Target User Is Chat", "** User Commands");
    }
}