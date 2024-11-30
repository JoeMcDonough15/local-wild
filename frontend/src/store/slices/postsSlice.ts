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

// thunks

// thunk to get a paginated batch of posts
export const getBatchOfPostsThunk = createAsyncThunk(
  "posts/getBatchOfPosts",
  async (getPostsOptions: GetPostsOptions, { dispatch }) => {
    try {
      const batchOfPosts = await serverMethods.posts.getBatch(getPostsOptions);
      dispatch(postsSlice.actions.setTotalNumPosts(batchOfPosts.totalNumPosts));
      dispatch(postsSlice.actions.addToAllPosts(batchOfPosts.posts));
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
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to create a post
export const makeNewPostThunk = createAsyncThunk(
  "posts/createNewPost",
  async (postDetails: FormData, { dispatch }) => {
    try {
      const newPost = await serverMethods.posts.create(postDetails);
      dispatch(postsSlice.actions.setCurrentPost(newPost));
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

// thunk to update a post
// when updating a post, be sure to update one of two parts of the store: either allPosts (if there's a key passed in that gets attached to the returned post.  There would be a key if we were editing the post from the My Posts page) or currentPost
export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async (postDetailsArgs: UpdateOrDeletePostArgs, { dispatch }) => {
    try {
      const { postId, postDetails, keyForStore } = postDetailsArgs;
      if (!postDetails) {
        throw new Error("You must provide post details if updating a post");
      }
      const updatedPost = await serverMethods.posts.update(postId, postDetails);
      if (keyForStore) {
        // if there's a key, that means we're updating this post from the My Posts page
        updatedPost.key = keyForStore;

        dispatch(postsSlice.actions.updateOneOfAllPosts(updatedPost));
      } else {
        // if there's no key, we're updating this post from a Post Details page modal
        dispatch(postsSlice.actions.setCurrentPost(updatedPost));
      }
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
      const { postId, keyForStore } = deleteDetails;
      const deleteSuccessful = await serverMethods.posts.delete(postId);
      if (deleteSuccessful && keyForStore) {
        dispatch(postsSlice.actions.removeFromAllPosts(keyForStore));
      } else if (deleteSuccessful) {
        dispatch(postsSlice.actions.clearCurrentPost());
      }
    } catch (error: any) {
      const errorResponse: ServerError = error;
      return errorResponse;
    }
  }
);

interface PostsState {
  totalNumPosts: number;
  allPosts: Record<number, Post>;
  currentPost: Post | null;
}

const initialState: PostsState = {
  totalNumPosts: 0,
  allPosts: {},
  currentPost: null,
};

// reducer
export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setTotalNumPosts: (state, action: PayloadAction<number>) => {
      state.totalNumPosts = action.payload;
    },
    addToAllPosts: (state, action: PayloadAction<Post[]>) => {
      // this should add a batch of x posts to the object when the thunk is dispatched to getBatchOfPosts
      const nextKey = Object.keys(state.allPosts).length + 1;
      if (nextKey > state.totalNumPosts) return;
      const newObj: Record<number, Post> = {};
      const arrOfPosts = action.payload;
      arrOfPosts.map((post, index) => {
        newObj[nextKey + index] = post;
      });
      const finalState = { ...state.allPosts, ...newObj };
      state.allPosts = finalState;
    },
    removeFromAllPosts: (state, action: PayloadAction<number>) => {
      // for use when a user deletes one of their posts from the My Posts page
      // we want to see that single post removed from the posts that are being used as state for that user's individual posts page
      // number in the PayloadAction refers to the key we're removing from state.allPosts, not the id of the post that was just deleted.
      // ! delete requires refresh, so it's not working; also test decrementing the totalNumPosts
      delete state.allPosts[action.payload];
      state.totalNumPosts--;
    },
    updateOneOfAllPosts: (state, action: PayloadAction<Post>) => {
      // for use when editing a post from the My Posts page.  A list of all the posts I've made are displayed
      // using state.allPosts, converted into an array and then mapped over to render each post thumbnail, title, and edit/delete buttons.
      // when clicking edit or delete, use the key that react required when rendering all of the post rows, to update/delete this specific
      // post from allPosts.  That way, when the modal closes from editing or confirming delete, we see the necessary change
      // on the page listing all the posts that belong to that user.
      const updatedPost = action.payload;
      if (!updatedPost.key) {
        throw new Error(
          "You must provide a key to the store when updating a post inside allPosts"
        );
      }
      state.allPosts[updatedPost.key] = action.payload;
    },
    clearAllPosts: (state) => {
      // for anytime the user navigates to/from the homepage, a profile page, or their own posts page
      // this runs in the first useEffect hook of the posts carousel and whatever component I'm using to list a user's individual posts
      // this should be dispatched as an action from the component, not a thunk
      state.allPosts = {};
    },
    setCurrentPost: (state, action: PayloadAction<Post>) => {
      // for use when viewing a post's details page, creating a new post, or updating a post from that post details page.
      // Set the post being viewed, new post, or updated post to state.currentPost then either populate the current post's
      // component, redirect the user to
      // their new post's details page (create), or close the modal
      // and show the updated post on that post's details page (update) from where they clicked edit.
      state.currentPost = action.payload;
    },
    clearCurrentPost: (state) => {
      // for use when deleting a post from the post's details page.
      // set currentPost to null and then redirect user to My Posts page to see any remaining posts of theirs.
      state.currentPost = null;
    },
  },
});

export default postsSlice.reducer;
