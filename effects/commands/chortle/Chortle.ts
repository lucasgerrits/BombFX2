import { BombFX } from "../../../app/BombFX.js";
import { Logger } from "../../../app/Logger.js";
import { Util } from "../../../app/util/Util.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export class Chortle {

    public static async react() {

        await app.obs.showSource("cfbChortle", "** Videos");

        await Util.sleep(9000);

        await app.obs.hideSource("cfbChortle", "** Videos");
    }
}