import { BombFX } from "../app/BombFX.js";
import { actionTriggers } from "./chattriggers/actions.js";
import { clipTriggers } from "./chattriggers/clipsvods.js";
import { counterTriggers } from "./chattriggers/counters.js";
import { linkTriggers } from "./chattriggers/externallinks.js";
import { socialTriggers } from "./chattriggers/socials.js";
import { spamTriggers } from "./chattriggers/spam.js";
import { textTriggers } from "./chattriggers/texts.js";
import type { ChatTriggerData } from "../types/AppTypes";

declare var app: BombFX;

export const triggerList: Array<ChatTriggerData> = [
    ...actionTriggers,
    ...clipTriggers,
    ...counterTriggers,
    ...linkTriggers,
    ...socialTriggers,
    ...spamTriggers,
    ...textTriggers
];