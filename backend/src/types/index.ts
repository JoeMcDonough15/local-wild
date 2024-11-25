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
  posts?: Post[];
  comments?: CommentOnPost[];
}

export interface SafeUser {
  id: number;
  email: string;
  username: string;
}

export interface ApiError {
  title?: string;
  errors?: Record<string, string>;
  status?: number;
  message?: string;
}

declare global {
  namespace Express {
    interface Request {
      // user: User | null; // this was working
      user: SafeUser | null;
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
