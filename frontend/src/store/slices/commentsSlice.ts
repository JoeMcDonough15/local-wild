import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  CommentOnPost,
  NewComment,
  ServerError,
  UpdateComment,
} from "../../types";
import serverMethods from "../api";

// thunks

export const createCommentThunk = createAsyncThunk(
  "comments/create",
  async (newComment: NewComment, { dispatch }) => {
    try {
      const postedComment = await serverMethods.comments.create(newComment);
      dispatch(commentsSlice.actions.addComment(postedComment));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

export const updateCommentThunk = createAsyncThunk(
  "comments/update",
  async (comment: UpdateComment, { dispatch }) => {
    try {
      const updatedComment = await serverMethods.comments.update(comment);
      dispatch(commentsSlice.actions.updateComment(updatedComment));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

export const deleteCommentThunk = createAsyncThunk(
  "comments/delete",
  async (commentId: number, { dispatch }) => {
    try {
      const deleteSuccessful = await serverMethods.comments.delete(commentId);
      if (deleteSuccessful) {
        dispatch(commentsSlice.actions.deleteComment(commentId));
      }
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// replies thunks

interface CommentsState {
  allComments: Record<number, CommentOnPost>;
  totalNumComments: number;
}

const initialState: CommentsState = {
  allComments: {},
  totalNumComments: 0,
};

export const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    setComments: (state, action: PayloadAction<CommentOnPost[]>) => {
      state.allComments = {};
      state.totalNumComments = 0;
      const commentsArray = action.payload;
      state.totalNumComments = commentsArray.length;
      commentsArray.map((comment) => {
        state.allComments[comment.id] = comment;
      });
    },
    addComment: (state, action: PayloadAction<CommentOnPost>) => {
      const commentToAdd = action.payload;
      const nextKey = Object.keys(state.allComments).length + 1;
      state.allComments[nextKey] = commentToAdd;
      state.totalNumComments++;
    },
    updateComment: (state, action: PayloadAction<CommentOnPost>) => {
      const updatedComment = action.payload;
      state.allComments[updatedComment.id] = updatedComment;
    },
    deleteComment: (state, action: PayloadAction<number>) => {
      const commentId = action.payload;
      delete state.allComments[commentId];
      state.totalNumComments--;
    },
  },
});

export default commentsSlice.reducer;
