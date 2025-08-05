import {useDispatch, useSelector, type TypedUseSelectorHook} from "react-redux";
import {type AppDispatch, type RootState} from "./store.ts";

type DispatchFunction = () => AppDispatch;

export const useAppDispatch: DispatchFunction = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;