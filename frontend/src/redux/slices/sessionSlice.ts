import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { User, Login, ServerError, Signup, SafeUser } from "../../types";
import serverMethods from "../api";

interface SessionState {
  sessionUser: User | SafeUser | null;
}

const initialState: SessionState = {
  sessionUser: null,
};

// thunks

// thunk to log a user in
export const loginThunk = createAsyncThunk(
  "session/login",
  async (
    credentials: Login,
    { dispatch }
  ): Promise<ServerError | undefined> => {
    try {
      // sends out the request, throws any errors necessary, parses the response
      const loggedInUser: User = await serverMethods.session.login(credentials);
      // dispatch an action that adds this user to the store, no need to return?
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
    await serverMethods.session.logout();
    dispatch(sessionSlice.actions.removeUser());
  }
);

// thunk to signup a user
export const signupThunk = createAsyncThunk(
  "session/signup",
  async (userDetails: Signup, { dispatch }): Promise<ServerError | User> => {
    try {
      const newUser = await serverMethods.session.signUp(userDetails);
      dispatch(sessionSlice.actions.setUser(newUser));
      return newUser;
    } catch (error) {
      if (error instanceof Error) {
        const errorResponse: ServerError = error;
        return errorResponse;
      }
      throw error;
    }
  }
);

// thunk to deactivate a user's account
export const deactivateAccountThunk = createAsyncThunk(
  "session/deactivate",
  async (_: null, { dispatch }) => {
    await serverMethods.session.deleteAccount();
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
