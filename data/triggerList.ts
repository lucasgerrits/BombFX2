import { actionTriggers } from "./chattriggers/actions.js";
import { clipTriggers } from "./chattriggers/clipsvods.js";
import { controlTriggers } from "./chattriggers/controls.js";
import { counterTriggers } from "./chattriggers/counters.js";
import { linkTriggers } from "./chattriggers/externallinks.js";
import { socialTriggers } from "./chattriggers/socials.js";
import { spamTriggers } from "./chattriggers/spam.js";
import { textTriggers } from "./chattriggers/texts.js";
import type { ChatTriggerData } from "../types/AppTypes";

export const triggerList: Array<ChatTriggerData> = [
    ...actionTriggers,
    ...clipTriggers,
    ...controlTriggers,
    ...counterTriggers,
    ...linkTriggers,
    ...socialTriggers,
    ...spamTriggers,
    ...textTriggers
];