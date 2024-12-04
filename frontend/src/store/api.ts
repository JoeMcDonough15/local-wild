import Cookies from "js-cookie";
import type {
  Login,
  User,
  Signup,
  Post,
  PostUpdate,
  GetPostsOptions,
  BatchOfPosts,
  NewComment,
  CommentOnPost,
  UpdateComment,
} from "../types";

const URL_ROOT = "/api";

async function fetchWithJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const xsrfToken =
    Cookies.get("XSRF-TOKEN") ||
    (await fetch(`${URL_ROOT}/csrf/restore`)
      .then((data) => data.json())
      .then((tokenObject) => tokenObject.token));
  if (!xsrfToken) throw new Error("No xsrf-token");
  options.method = options.method || "GET";
  if (options.method === "GET") {
    options.headers = {};
  } else if (xsrfToken) {
    options.headers = {
      "Content-Type": "application/json",
      "XSRF-Token": xsrfToken,
    };
  }
  const response = await fetch(`${URL_ROOT}${url}`, options);

  const parsedResponse = await response.json();

  if (response.status >= 400) {
    throw parsedResponse;
  }

  return parsedResponse;
}

async function fetchWithFormData<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const xsrfToken =
    Cookies.get("XSRF-TOKEN") ||
    (await fetch(`${URL_ROOT}/csrf/restore`)
      .then((data) => data.json())
      .then((tokenObject) => tokenObject.token));
  if (!xsrfToken) throw new Error("No xsrf-token");
  const requestOptions = { ...options, headers: { "XSRF-Token": xsrfToken } };

  const response = await fetch(`${URL_ROOT}${url}`, requestOptions);

  const parsedResponse = await response.json();

  if (response.status >= 400) {
    throw parsedResponse;
  }

  return parsedResponse;
}

const serverMethods = {
  session: {
    restore: async (): Promise<User | null> => {
      const data: { user: User | null } = await fetchWithJson("/session");
      return data.user;
    },
    login: async (loginCredentials: Login): Promise<User> => {
      const data: { user: User } = await fetchWithJson("/session", {
        method: "POST",
        body: JSON.stringify(loginCredentials),
      });
      return data.user;
    },
    logout: async (): Promise<string> => {
      const data: { message: string } = await fetchWithJson("/session", {
        method: "DELETE",
      });
      return data.message;
    },
    signUp: async (userDetails: Signup): Promise<User> => {
      const data: { user: User } = await fetchWithJson("/session/signup", {
        method: "POST",
        body: JSON.stringify(userDetails),
      });
      return data.user;
    },
    updateUserProfile: async (body: FormData): Promise<User> => {
      const data: { user: User } = await fetchWithFormData(`/session`, {
        method: "PUT",
        body,
      });
      return data.user;
    },
    deleteAccount: async (): Promise<string> => {
      const data: { message: string } = await fetchWithJson(
        "/session/deactivate",
        { method: "DELETE" }
      );
      return data.message;
    },
  },
  users: {
    getUser: async (userId: number): Promise<User> => {
      const data: { user: User } = await fetchWithJson(`/users/${userId}`);
      return data.user;
    },
  },
  posts: {
    getBatch: async (
      getPostsOptions: GetPostsOptions
    ): Promise<BatchOfPosts> => {
      const { givenSize, slideOrPageNum, userId } = getPostsOptions;
      let url = `/posts?slide=${slideOrPageNum}`;
      if (givenSize !== undefined) {
        url += `&givenSize=${givenSize}`;
      }
      if (userId) {
        url += `&userId=${userId}`;
      }
      const data: BatchOfPosts = await fetchWithJson(url);
      return data;
    },
    // getOne associates comments so it handles reading for that feature
    getOne: async (postId: number): Promise<Post> => {
      const data: { post: Post } = await fetchWithJson(`/posts/${postId}`);
      return data.post;
    },
    create: async (formData: FormData): Promise<Post> => {
      const data: { post: Post } = await fetchWithFormData("/posts", {
        method: "POST",
        body: formData,
      });

      return data.post;
    },
    update: async (postId: number, newPostData: PostUpdate): Promise<Post> => {
      const data: { post: Post } = await fetchWithJson(`/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify(newPostData),
      });
      return data.post;
    },
    delete: async (postId: number): Promise<string> => {
      const data: { message: string } = await fetchWithJson(
        `/posts/${postId}`,
        { method: "DELETE" }
      );
      return data.message;
    },
  },
  comments: {
    create: async (newComment: NewComment): Promise<CommentOnPost> => {
      const data: { comment: CommentOnPost } = await fetchWithJson(
        "/comments",
        { method: "POST", body: JSON.stringify(newComment) }
      );
      return data.comment;
    },
    update: async (commentToUpdate: UpdateComment): Promise<CommentOnPost> => {
      const data: { comment: CommentOnPost } = await fetchWithJson(
        `/comments/${commentToUpdate.commentId}`,
        { method: "PUT", body: JSON.stringify(commentToUpdate) }
      );
      return data.comment;
    },
    delete: async (commentId: number): Promise<string> => {
      const data: { message: string } = await fetchWithJson(
        `/comments/${commentId}`,
        { method: "DELETE" }
      );
      return data.message;
    },
  },
  maps: {
    retrieveKey: async (): Promise<string> => {
      const data: { key: string } = await fetchWithJson("/maps/key", {
        method: "POST",
      });

      return data.key;
    },
  },
};

export default serverMethods;
