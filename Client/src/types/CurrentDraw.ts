import type {DrawEntry} from "./DrawEntry.ts";
import type {DrawWinner} from "./DrawWinner.ts";
import type {CurrentDrawInfo} from "./CurrentDrawInfo.ts";
import type {DrawOrder} from "./DrawOrder.ts";

export type CurrentDraw = {
    drawInfo: CurrentDrawInfo,
    drawOrder: DrawOrder,
    numberSelectionTime: number,
    entries: DrawEntry[],
    winners: DrawWinner[],
}