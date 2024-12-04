import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import serverMethods from "../api";

export const getKeyThunk = createAsyncThunk(
  "maps/getKey",
  async (_, { dispatch }) => {
    const key = await serverMethods.maps.retrieveKey();
    dispatch(mapsSlice.actions.setKey(key));
  }
);

interface MapsState {
  mapsKey: string | null;
}

const initialState: MapsState = {
  mapsKey: null,
};

export const mapsSlice = createSlice({
  name: "maps",
  initialState,
  reducers: {
    setKey: (state, action: PayloadAction<string>) => {
      state.mapsKey = action.payload;
    },
  },
});

export default mapsSlice.reducer;
