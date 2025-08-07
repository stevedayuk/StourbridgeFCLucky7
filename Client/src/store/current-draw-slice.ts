import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {CurrentDraw} from "../types/CurrentDraw.ts";
import type {DrawEntry} from "../types/DrawEntry.ts";
import type {DrawOrder} from "../types/DrawOrder.ts";

type CurrentDrawState = {
    draw: CurrentDraw | null;
}

const initialState: CurrentDrawState = {
    draw: null,
};

export const currentDrawSlice = createSlice({
    name: 'currentDraw',
    initialState: initialState,
    reducers: {
        populateDrawEntries(state, action: PayloadAction<CurrentDraw>) {
            state.draw = action.payload;
        },
        setAsWinner(state, action: PayloadAction<{
            drawEntry: DrawEntry,
            prizeAmount: number,
            drawOrder: DrawOrder,
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
                name: action.payload.drawEntry.name,
                number: action.payload.drawEntry.number
            };

            if (!action.payload.isTest) {
                return;
            }
        }
    }
});

export const {populateDrawEntries, setAsWinner} = currentDrawSlice.actions;