import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import sessionReducer from "./slices/sessionSlice";
import usersReducer from "./slices/userSlice";
// import postsReducer from ".slices//postSlice";
// import commentsReducer from "./slices/commentsSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    users: usersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();