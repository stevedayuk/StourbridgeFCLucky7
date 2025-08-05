import type {DrawEntry} from "./DrawEntry.ts";
import type {DrawWinner} from "./DrawWinner.ts";
import type {CurrentDrawInfo} from "./CurrentDrawInfo.ts";

export type CurrentDraw = {
    drawInfo: CurrentDrawInfo,
    drawOrder: "lowest_first" | "highest_first",
    numberSelectionTime: number,
    entries: DrawEntry[],
    winners: DrawWinner[],
}