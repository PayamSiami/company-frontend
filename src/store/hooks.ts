// frontend-company/src/store/hooks.ts
import { useDispatch, useSelector } from "react-redux";
// ✅ Use type-only import for TypedUseSelectorHook
import type { TypedUseSelectorHook } from "react-redux";
// ✅ Use type-only imports for RootState and AppDispatch
import type { RootState, AppDispatch } from "./index";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
