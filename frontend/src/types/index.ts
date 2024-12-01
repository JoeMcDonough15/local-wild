export interface ServerError {
  title?: string;
  errors?: Record<string, string>;
  message?: string;
  status?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profileImageUrl: string | null;
  location: string | null;
  numYearsExperience: number | null;
  favoriteSubject: string | null;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
  comments: CommentOnPost[];
}

export interface SafeUser {
  id: number;
  email: string;
  username: string;
}

export interface PostUpdate {
  title: string;
  caption?: string;
  fullDescription?: string;
  lat?: number;
  lng?: number;
  partOfDay?: string;
  datePhotographed?: Date;
}

export interface Post extends PostUpdate {
  id: number;
  imageUrl: string;
  photographer?: { username: string; id: number };
  photographerId: number;
  comments?: CommentOnPost[];
  createdAt: Date;
  updatedAt: Date;
  key?: number;
}

export interface UpdateOrDeletePostArgs {
  postId: number;
  postDetails?: PostUpdate;
  keyForStore?: number;
}

export interface BatchOfPosts {
  posts: Post[];
  totalNumPosts: number;
}

export interface CommentOnPost {
  id: number;
  commentText: string;
  postId: number;
  commenterId: number;
  createdAt: Date;
  updatedAt: Date;
  replies: CommentReply[];
}

export interface CommentReply {
  id: number;
  replyText: string;
  replyingTo: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Login {
  email: string;
  password: string;
}

export interface Signup {
  username: string;
  email: string;
  password: string;
}

export interface GetPostsOptions {
  givenSize?: number;
  slideOrPageNum: number;
  userId?: number;
}

export interface NewComment {
  commentText: string;
  postId: number;
}

export interface UpdateComment {
  commentId: number;
  commentText: string;
}

export type LoadingState = "no" | "loading" | "response" | "finished";
