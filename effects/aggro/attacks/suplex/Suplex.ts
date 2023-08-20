import { BombFX } from "../../../../app/BombFX.js";
import { Util } from "../../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const suplex = async () => {
    const effectScene: string = "Suplex";
    const sceneClone: string = "Suplex Current Scene Clone";
    const vertFlipFilter: string = "3D Effect - Vertical Flip";

    // Get current scene
    const currentScene: string = await app.obs.getCurrentSceneName();

    // Set current scene to source mirror properties
    if (currentScene !== effectScene) {
        await app.obs.changeMirrorSource(sceneClone, currentScene);

        // Switch to suplex scene
        await app.obs.setScene(effectScene);
    }
    await Util.sleep(500);

    // Play suplex video
    await app.obs.showSource("Suplex Dot Webm", effectScene);
    await Util.sleep(6500);

    // Apply filter to move source mirror up
    await app.obs.showFilter(effectScene, "Suplex - Up");
    await Util.sleep(300);

    // Apply filter to vertical flip current scene
    await app.obs.showFilter(sceneClone, vertFlipFilter);
    await Util.sleep(1250);

    // Undo flip fliter to return scene to proper vertical orientation
    await app.obs.hideFilter(sceneClone, vertFlipFilter);
    await Util.sleep(2000);

    // Revert to original scene
    if (currentScene !== effectScene) {
        await app.obs.setScene(currentScene);
    }
    
    // Turn off video
    await app.obs.hideSource("Suplex Dot Webm", effectScene);
};