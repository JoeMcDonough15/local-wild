import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { User, Login, ServerError } from "../../types";
import serverMethods from "../api";

interface SessionState {
  sessionUser: User | null;
}

const initialState: SessionState = {
  sessionUser: null,
};

// thunks

// thunk to get currently logged in user or remove any user if no one is logged in

export const restoreUser = createAsyncThunk(
  "session/restore",
  async (_: null, { dispatch }) => {
    try {
      const currentUser = await serverMethods.session.restore();
      dispatch(sessionSlice.actions.setUser(currentUser));
    } catch (e) {
      dispatch(sessionSlice.actions.removeUser());
    }
  }
);

// thunk to log a user in
export const loginThunk = createAsyncThunk(
  "session/login",
  async (
    credentials: Login,
    { dispatch }
  ): Promise<ServerError | undefined> => {
    try {
      // sends out the request, throws any errors necessary, parses the response
      const loggedInUser = await serverMethods.session.login(credentials);
      // dispatch an action that adds this user to the store
      dispatch(sessionSlice.actions.setUser(loggedInUser));
    } catch (error) {
      if (error instanceof Error) {
        const errorResponse: ServerError = error;
        return errorResponse;
      }
      throw error;
    }
  }
);

// thunk to logout a user

export const logoutThunk = createAsyncThunk(
  "session/logout",
  async (_: null, { dispatch }) => {
    dispatch(sessionSlice.actions.removeUser());
  }
);

// reducer

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.sessionUser = action.payload;
    },

    removeUser: (state) => {
      state.sessionUser = null;
    },
  },
});

export default sessionSlice.reducer;
