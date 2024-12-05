import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User, ServerError } from "../../types";
import serverMethods from "../api";
import { postsSlice } from "./postsSlice";

// thunks

// get a user's details (for profile page viewing)
export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async (userId: number, { dispatch }) => {
    try {
      const userDetails = await serverMethods.users.getUser(userId);
      dispatch(userSlice.actions.setCurrentUser(userDetails));
      dispatch(postsSlice.actions.setAllPosts(userDetails.posts));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null,
};

// reducer
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
    },
    removeCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
});

export default userSlice.reducer;
