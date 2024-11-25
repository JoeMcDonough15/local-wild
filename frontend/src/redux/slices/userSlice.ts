import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User, ServerError, Signup } from "../../types";
import serverMethods from "../api";

type UserState = {};
