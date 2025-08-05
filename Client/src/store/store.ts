import {configureStore} from '@reduxjs/toolkit';
import {currentDrawSlice} from "./current-draw-slice.ts";

export const store = configureStore({
    reducer: {
        currentDraw: currentDrawSlice.reducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;