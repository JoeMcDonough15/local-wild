import Cookies from "js-cookie";
import type {
  Login,
  ConfirmationMessage,
  User,
  Signup,
  SafeUser,
} from "../types";

const xsrfToken = Cookies.get("XSRF-TOKEN");

const URL_ROOT = "/api";

async function fetchWithJson<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  if (!xsrfToken) throw new Error("No xsrf-token");
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
    const error = await response.json();
    throw error;
  }

  return await response.json();
}

async function fetchWithFormData<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
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
    login: async (loginCredentials: Login): Promise<User> => {
      return fetchWithJson("/session", {
        method: "POST",
        body: JSON.stringify(loginCredentials),
      });
    },
    logout: async (): Promise<ConfirmationMessage> => {
      return fetchWithJson("/session", { method: "DELETE" });
    },
    signUp: async (userDetails: Signup): Promise<User> => {
      return fetchWithJson("/session/signup", {
        method: "POST",
        body: JSON.stringify(userDetails),
      });
    },
    deleteAccount: async (): Promise<ConfirmationMessage> => {
      return fetchWithJson("/session/deactivate", { method: "DELETE" });
    },
  },
  users: {},
};

export default serverMethods;
