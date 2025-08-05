import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
import type {CurrentDraw} from "../types/CurrentDraw.ts";


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
        setAsWinner(state, action: PayloadAction<{ number: number, prizeAmount: number }>) {
            const entryIndex = state.draw?.entries.findIndex(entry => entry.number === action.payload.number);
            if (entryIndex !== undefined && entryIndex !== -1) {
                state.draw!.entries[entryIndex].isWinner = true;
                //TODO: Add prize amount to winners array
            }
        }
    }
});

export const {populateDrawEntries, setAsWinner} = currentDrawSlice.actions;