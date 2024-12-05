import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import type {
  ServerError,
  Post,
  UpdateOrDeletePostArgs,
  GetPostsOptions,
} from "../../types";
import serverMethods from "../api";
import { commentsSlice } from "./commentsSlice";

// thunks

// thunk to get all posts - either all posts for homepage or posts that belong to a specific user for UserProfile/MyPosts
export const getAllPostsThunk = createAsyncThunk(
  "posts/getBatchOfPosts",
  async (getPostsOptions: GetPostsOptions, { dispatch }) => {
    try {
      const batchOfPosts = await serverMethods.posts.getBatch(getPostsOptions);
      dispatch(postsSlice.actions.setAllPosts(batchOfPosts.posts));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to get a single post
export const getSinglePostThunk = createAsyncThunk(
  "posts/getOnePost",
  async (postId: number, { dispatch }) => {
    try {
      const singlePost = await serverMethods.posts.getOne(postId);
      dispatch(postsSlice.actions.setCurrentPost(singlePost));
      if (singlePost.comments) {
        dispatch(commentsSlice.actions.setComments(singlePost.comments));
      }
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to create a post
export const makeNewPostThunk = createAsyncThunk(
  "posts/createNewPost",
  async (formData: FormData, { dispatch }): Promise<Post | ServerError> => {
    try {
      const newPost = await serverMethods.posts.create(formData);
      dispatch(postsSlice.actions.setCurrentPost(newPost));
      return newPost;
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to update a post
export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async (postDetailsArgs: UpdateOrDeletePostArgs, { dispatch }) => {
    try {
      const { postId, postDetails } = postDetailsArgs;
      if (!postDetails) {
        throw new Error("You must provide post details if updating a post");
      }
      const updatedPost = await serverMethods.posts.update(postId, postDetails);
      dispatch(postsSlice.actions.updatePost(updatedPost));
      dispatch(postsSlice.actions.setCurrentPost(updatedPost));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to delete a post
export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (deleteDetails: UpdateOrDeletePostArgs, { dispatch }) => {
    try {
      const { postId } = deleteDetails;
      const deleteSuccessful = await serverMethods.posts.delete(postId);
      if (deleteSuccessful) {
        dispatch(postsSlice.actions.deletePost(postId));
      }
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

interface PostsState {
  allPosts: Post[];
  allPostsFlattened: Record<number, Post>;
  currentPost: Post | null;
}

const initialState: PostsState = {
  allPosts: [],
  allPostsFlattened: {},
  currentPost: null,
};

// reducer
export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setAllPosts: (state, action: PayloadAction<Post[]>) => {
      state.allPostsFlattened = {};
      state.allPosts = [];
      const postsFromServer = action.payload;

      postsFromServer.forEach((post) => {
        state.allPostsFlattened[post.id] = post;
      });
      state.allPosts = postsFromServer;
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const updatedPost = action.payload;
      const postIdToUpdate = action.payload.id;
      state.allPostsFlattened[postIdToUpdate] = updatedPost;
      state.allPosts = state.allPosts.map((post) => {
        if (post.id === postIdToUpdate) {
          return updatedPost;
        }
        return post;
      });
    },
    deletePost: (state, action: PayloadAction<number>) => {
      const postIdToDelete = action.payload;
      state.allPosts = state.allPosts.filter((post) => {
        return post.id !== postIdToDelete;
      });
      delete state.allPostsFlattened[action.payload];
    },
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      state.currentPost = action.payload;
    },
  },
});

export default postsSlice.reducer;
