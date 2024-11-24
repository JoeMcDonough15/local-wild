import Cookies from "js-cookie";
import type { Login, Post, SafeUser, ServerError, Signup } from "../types";

const xsrfToken = Cookies.get("XSRF-TOKEN") || "";

const URL_ROOT = "/api";

type ServerResponse = SafeUser | ServerError | { message: string };

const fetchWithJson = async (
  url: string,
  options: RequestInit = {}
): Promise<ServerResponse> => {
  options.method = options.method || "GET";
  if (options.method === "GET") {
    options.headers = {};
  } else {
    options.headers = {
      "Content-Type": "application/json",
      "XSRF-Token": xsrfToken,
    };
  }
  const response = await fetch(`${URL_ROOT}${url}`, options);

  if (response.status >= 400) {
    const error: ServerError = await response.json();
    return error;
  }

  return await response.json();
};

const fetchWithFormData = async (
  url: string,
  options: RequestInit = {}
): Promise<ServerResponse> => {
  const response = await fetch(`${URL_ROOT}${url}`, {
    ...options,
    headers: { "XSRF-Token": xsrfToken },
  });

  if (response.status >= 400) {
    const error: ServerError = await response.json();
    return error;
  }

  return await response.json();
};

export const serverMethods = {
  session: {
    restore: async (): Promise<SafeUser | ServerError> => {
      return fetchWithJson("/session");
    },
    login: async (loginCredentials: Login): Promise<SafeUser | ServerError> => {
      return fetchWithJson("/session", {
        method: "POST",
        body: JSON.stringify(loginCredentials),
      });
    },
    logout: async (): Promise<ServerResponse> => {
      return fetchWithJson("/session", { method: "DELETE" });
    },
  },
  users: {
    signUp: async (userDetails: Signup): Promise<SafeUser | ServerError> => {
      return fetchWithJson("/users", {
        method: "POST",
        body: JSON.stringify(userDetails),
      });
    },
    deleteAccount: async (): Promise<ServerResponse> => {
      return fetchWithJson("/users", { method: "DELETE" });
    },
  },
};
