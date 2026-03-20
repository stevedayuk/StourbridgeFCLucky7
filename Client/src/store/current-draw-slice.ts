import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {CurrentDraw} from "../types/CurrentDraw.ts";
import type {DrawEntry} from "../types/DrawEntry.ts";
import type {DrawOrder} from "../types/DrawOrder.ts";

type CurrentDrawState = {
    draw: CurrentDraw | null;
    isDrawComplete: boolean;
}

const initialState: CurrentDrawState = {
    draw: null,
    isDrawComplete: false,
};

export const currentDrawSlice = createSlice({
    name: 'currentDraw',
    initialState: initialState,
    reducers: {
        populateDrawEntries(state, action: PayloadAction<CurrentDraw>) {
            state.draw = action.payload;
        },
        revokeWinner(state, action: PayloadAction<{
            prizeAmount: number,
            number: number
        }>) {
            const drawWinnerIndexToRevoke = state.draw?.winners.findIndex(winner => winner.prizeAmount === action.payload.prizeAmount && winner.number === action.payload.number);
            state.draw!.winners[drawWinnerIndexToRevoke!] = {
                ...state.draw!.winners[drawWinnerIndexToRevoke!],
                number: null,
                name: null
            }
        },
        setAsWinner(state, action: PayloadAction<{
            drawEntry: DrawEntry,
            prizeAmount: number,
            drawOrder: DrawOrder,
            drawWinnerId?: number | null,
            isTest: boolean
        }>) {
            const entryIndex = state.draw?.entries.findIndex(entry => entry.number === action.payload.drawEntry.number);
            if (entryIndex === undefined || entryIndex === -1) {
                return;
            }
            state.draw!.entries[entryIndex].isWinner = true;
            const winnerIndex = action.payload.drawOrder === 'highest_first'
                ? state.draw?.winners.findIndex(entry => entry.prizeAmount === action.payload.prizeAmount && !entry.name)
                : state.draw?.winners.findLastIndex(entry => entry.prizeAmount === action.payload.prizeAmount && !entry.name);

            state.draw!.winners[winnerIndex!] = {
                ...state.draw!.winners[winnerIndex!],
                id: action.payload.drawWinnerId ?? null,
                name: action.payload.drawEntry.name,
                number: action.payload.drawEntry.number
            };

            if (!action.payload.isTest) {
                return;
            }
        },
        setDrawComplete(state, action: PayloadAction<boolean>) {
            state.isDrawComplete = action.payload;
        }
    }
});

export const {populateDrawEntries, revokeWinner, setAsWinner, setDrawComplete} = currentDrawSlice.actions;