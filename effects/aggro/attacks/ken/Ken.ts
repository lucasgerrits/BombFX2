import { BombFX } from "../../../../app/BombFX.js";
import { Util } from "../../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const ken = async () => {
    const effectScene = "Ken Throw";

    await app.obs.hideSource("SF2 Dot Webm", effectScene);

    // Get current scene
    const currentScene: string = await app.obs.getCurrentSceneName();

    // Set current scene to source mirror properties
    if (currentScene !== effectScene) {
        await app.obs.changeMirrorSource("Ken Current Scene Mirror", currentScene);

        // Switch to Ken scene
        await app.obs.setScene(effectScene);
    }
    await Util.sleep(500);

    // Play Ken video
    await app.obs.showSource("SF2 Dot Webm", effectScene);

    await Util.sleep(3400);

    // Apply first filter to move scene up and slightly left
    await app.obs.showFilter(effectScene, "Throw 1");

    // Await a length of time to play sound effects for hitting ground twice and CFB groan
    await Util.sleep(684);
    Util.playSound("effects/aggro/attacks/ken/audio/ElBounceroniWhenBeingThrownerino.mp3");
    Util.playSound("effects/aggro/attacks/ken/audio/CFBDefeat.mp3");

    // Await a duration of time to let the rest of the video play and put a few
    // seconds in between resetting the scene back to its original place
    await Util.sleep(4816); // 5500 before sfx were added

    // Reset scene placement
    await app.obs.showFilter(effectScene, "Throw Reset");

    // Switch back to original scene
    await Util.sleep(400);
    await app.obs.setScene(currentScene);
};