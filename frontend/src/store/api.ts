import Cookies from "js-cookie";
import type { Login, ConfirmationMessage, User, Signup } from "../types";

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

  if (response.status >= 400) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
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
  const response = await fetch(`${URL_ROOT}${url}`, {
    ...options,
    headers: { "XSRF-Token": xsrfToken },
  });

  if (response.status >= 400) {
    const error = await response.json();
    throw error;
  }

  return await response.json();
}

const serverMethods = {
  session: {
    restore: async (): Promise<User | null> => {
      const data: { user: User | null } = await fetchWithJson("/session");
      return data?.user;
    },
    login: async (loginCredentials: Login): Promise<User> => {
      const data: { user: User } = await fetchWithJson("/session", {
        method: "POST",
        body: JSON.stringify(loginCredentials),
      });
      return data.user;
    },
    logout: async (): Promise<string> => {
      return fetchWithJson("/session", { method: "DELETE" });
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
      return fetchWithJson("/session/deactivate", { method: "DELETE" });
    },
  },
  users: {
    getUser: async (userId: number): Promise<User> => {
      return fetchWithJson(`/users/${userId}`);
    },
  },
};

export default serverMethods;
