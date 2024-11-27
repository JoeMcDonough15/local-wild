import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type { User, Login, ServerError, Signup } from "../../types";
import serverMethods from "../api";
import { userSlice } from "../slices/userSlice";

// thunks

// thunk to restore logged in user
export const restoreUserThunk = createAsyncThunk(
  "session/restore",
  async (_, { dispatch }) => {
    const sessionUser = await serverMethods.session.restore();
    if (sessionUser) {
      dispatch(sessionSlice.actions.setUser(sessionUser));
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
      const loggedInUser: User = await serverMethods.session.login(credentials);

      // dispatch an action that adds this user to the store
      dispatch(sessionSlice.actions.setUser(loggedInUser));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to logout a user
export const logoutThunk = createAsyncThunk(
  "session/logout",
  async (_, { dispatch }) => {
    await serverMethods.session.logout();
    dispatch(sessionSlice.actions.removeUser());
    dispatch(userSlice.actions.removeCurrentUser());
  }
);

// thunk to signup a user
export const signupThunk = createAsyncThunk(
  "session/signup",
  async (
    userDetails: Signup,
    { dispatch }
  ): Promise<ServerError | undefined> => {
    try {
      const newUser = await serverMethods.session.signUp(userDetails);
      dispatch(sessionSlice.actions.setUser(newUser));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to update a user's profile
export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (
    formData: FormData,
    { dispatch }
  ): Promise<ServerError | undefined> => {
    try {
      const updatedUser = await serverMethods.session.updateUserProfile(
        formData
      );
      dispatch(sessionSlice.actions.setUser(updatedUser));
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
  async (_, { dispatch }) => {
    await serverMethods.session.deleteAccount();
    dispatch(sessionSlice.actions.removeUser());
    dispatch(userSlice.actions.removeCurrentUser());
  }
);

interface SessionState {
  sessionUser: User | null;
}

const initialState: SessionState = {
  sessionUser: null,
};

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
