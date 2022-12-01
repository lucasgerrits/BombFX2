import { BombFX } from "../../app/BombFX.js";
import { Util } from "../../app/util/Util.js";
import { suplex } from "./attacks/suplex/Suplex.js";

// eslint-disable-next-line no-var
declare var app: BombFX;

export const attacks: Record<string, (() => Promise<void>)> = {
    "suplex" : suplex
};