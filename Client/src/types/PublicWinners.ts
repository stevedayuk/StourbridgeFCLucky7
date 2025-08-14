import type {PublicDraw} from "./PublicDraw.ts";
import type {PublicWinner} from "./PublicWinner.ts";

export type PublicWinners = {
    draws: PublicDraw[],
    currentDrawWinners: PublicWinner[];
}