import { BombFX } from "../../../../app/BombFX.js";
import { Util } from "../../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const red = async () => {
    const effectScene: string = "Seeing Red";
    const sceneCloneLeft: string = "Seeing Red - Left Scene Clone";
    const sceneCloneRight: string = "Seeing Red - Right Scene Clone";

    // Get current scene
    const currentScene: string = await app.obs.getCurrentSceneName();

    // Set current scene to both source clone properties
    if (currentScene !== effectScene) {
        await app.obs.setCloneSource(sceneCloneLeft, currentScene);
        await app.obs.setCloneSource(sceneCloneRight, currentScene);
        // Switch to effect scene
        await app.obs.setScene(effectScene);
    }

    await Util.sleep(1000);

    // Move goggles into position
    await app.obs.showFilter(effectScene, "Move Goggles Center");

    await Util.sleep(1500);

    // Play audio
    Util.playSound("./effects/jambreak/jams/red/TheRed.mp3");
    
    // Fade in eye screens
    app.obs.showSource(sceneCloneLeft, effectScene);
    app.obs.showSource(sceneCloneRight, effectScene);

    await Util.sleep(500);

    // Start regular speed zoom blur filters
    app.obs.showFilter(sceneCloneLeft, "Zoom Blur");
    app.obs.showFilter(sceneCloneRight, "Zoom Blur");

    // Start goggle wiggle filter
    await app.obs.showFilter(effectScene, "Move Goggles Left");

    await Util.sleep(19000);
    
    // Start faster speed zoom blur filters
    app.obs.showFilter(sceneCloneLeft, "Zoom Blur Faster");
    app.obs.showFilter(sceneCloneRight, "Zoom Blur Faster");

    // Stop regular speed zoom blur filters
    app.obs.hideFilter(sceneCloneLeft, "Zoom Blur");
    app.obs.hideFilter(sceneCloneRight, "Zoom Blur");

    await Util.sleep(6000);

    // Fade out eye screens
    app.obs.hideSource(sceneCloneLeft, effectScene);
    app.obs.hideSource(sceneCloneRight, effectScene);

    // Turn off wiggle filters
    app.obs.hideFilter(effectScene, "Move Goggles Left");
    app.obs.hideFilter(effectScene, "Move Goggles Right");

    await Util.sleep(500);

    // Move goggles back out of view
    app.obs.showFilter(effectScene, "Move Goggles Bottom");

    await Util.sleep(1900);
    await app.obs.setScene(currentScene);

    // Stop faster speed zoom blur filters
    app.obs.hideFilter(sceneCloneLeft, "Zoom Blur Faster");
    app.obs.hideFilter(sceneCloneRight, "Zoom Blur Faster");
};