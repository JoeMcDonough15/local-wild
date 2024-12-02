export interface User {
  id?: number;
  username?: string;
  email?: string;
  password?: string;
  profileImageUrl?: string | null;
  location?: string | null;
  numYearsExperience?: number | null;
  favoriteSubject?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  posts?: ExistingPost[];
  comments?: CommentOnPost[];
}

export interface SafeUser {
  id: number;
  email: string;
  username: string;
}

export interface NewUser {
  username: string;
  email: string;
  password: string;
}

export interface ApiError extends Error {
  errors?: Record<string, string>;
  status?: number;
}

declare global {
  namespace Express {
    interface Request {
      user: SafeUser | null;
    }
  }
}

export interface NewPost {
  imageUrl: string;
  title: string;
  photographerId: number;
  caption?: string;
  fullDescription?: string;
  lat?: number;
  lng?: number;
  partOfDay?: string;
  datePhotographed?: Date;
}

export interface ExistingPost extends NewPost {
  id: number;
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
