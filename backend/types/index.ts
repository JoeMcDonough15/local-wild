import { Request } from "express";

export interface ApiError extends Error {
  title?: string;
  errors?: Error;
  status?: number;
}

export interface User {
  id: number;
  username: string;
  email: string;
  profileImageUrl?: string;
  location?: string;
  numYearsExperience?: number;
  favoriteSubject?: string;
  createdAt: Date;
  updatedAt: Date;
  posts: Post[];
  comments: CommentOnPost[];
}

declare global {
  namespace Express {
    interface Request {
      user: User | null;
    }
  }
}

export interface Post {
  id: number;
  imageUrl: string;
  title: string;
  photographerId: number;
  caption?: string;
  fullDescription?: string;
  lat?: number;
  lng?: number;
  partOfDay?: string;
  datePhotographed?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: CommentOnPost[];
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
