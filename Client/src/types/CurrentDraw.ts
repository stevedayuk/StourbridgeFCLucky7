import type {DrawEntry} from "./DrawEntry.ts";
import type {DrawWinner} from "./DrawWinner.ts";
import type {CurrentDrawInfo} from "./CurrentDrawInfo.ts";
import type {DrawOrder} from "./DrawOrder.ts";

export type CurrentDraw = {
    drawId: number | null,
    isTest: boolean,
    drawInfo: CurrentDrawInfo | null,
    drawOrder: DrawOrder,
    numberSelectionTime: number,
    entries: DrawEntry[],
    winners: DrawWinner[],
}