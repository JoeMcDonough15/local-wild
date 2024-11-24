import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
// import sessionReducer from "./slices/sessionSlice";
// import userReducer from "./slices/userSlice";
// import postReducer from ".slices//postSlice";
// import commentReducer from "./slices/commentsSlice";

export const store = configureStore({
  reducer: {},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
