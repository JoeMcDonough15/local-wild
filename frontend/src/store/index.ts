import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import sessionReducer from "./slices/sessionSlice";
import usersReducer from "./slices/userSlice";
import postsReducer from "./slices/postsSlice";
import commentsReducer from "./slices/commentsSlice";
import mapsReducer from "./slices/mapsSlice";

export const store = configureStore({
  reducer: {
    session: sessionReducer,
    users: usersReducer,
    posts: postsReducer,
    comments: commentsReducer,
    maps: mapsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
