import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  clearCookie,
  clearStore,
  getCookie,
  getStore,
  setCookie,
  setStore,
} from "./setting";

/**
 * Base URL of the Agrimarket REST API.
 *
 * The value is read from `VITE_API_URL` so it can be pointed at a local
 * backend without touching the source code. It falls back to the deployed
 * instance when the variable is not set.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://agrimarket-z5f0.onrender.com/api/v1";

/**
 * Path of the endpoint used to exchange a refresh token for a new access
 * token. Verified against the live API: `POST /users/token/refresh`.
 */
const REFRESH_ENDPOINT = "users/token/refresh";

/** Extra property used to make sure a request is only retried once. */
type RetriableRequest = InternalAxiosRequestConfig & { _retried?: boolean };

/** Reads the refresh token from the cookie that the backend sets on login. */
export const getRefreshToken = () => getCookie(REFRESH_TOKEN);

/** Persists a new pair of tokens issued by the refresh endpoint. */
export const saveTokens = (accessToken: string, refreshToken?: string) => {
  if (accessToken) setStore(ACCESS_TOKEN, accessToken);
  if (refreshToken) setCookie(REFRESH_TOKEN, refreshToken, 7);
};

/** Removes every trace of the current session. */
export const clearTokens = () => {
  clearStore(ACCESS_TOKEN);
  clearCookie(REFRESH_TOKEN);
};

/**
 * In-flight refresh promise.
 *
 * Several requests can fail with 401 at the same time. Without this guard
 * each of them would trigger its own refresh call and the refresh token
 * would be rotated several times, invalidating the session. Sharing a single
 * promise makes sure the backend is only asked once.
 */
let refreshPromise: Promise<string | null> | null = null;

/**
 * Requests a brand new access token using the refresh token.
 *
 * Returns `null` when the refresh token is missing or has been rejected,
 * in which case the session has to be terminated.
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = doRefreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const doRefreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/${REFRESH_ENDPOINT}`,
      { refresh_token: refreshToken },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    const payload = response.data?.data ?? response.data;
    const accessToken = payload?.access_token;
    const newRefreshToken = payload?.refresh_token;

    if (!accessToken) return null;

    saveTokens(accessToken, newRefreshToken);
    return accessToken;
  } catch (error) {
    return null;
  }
};

export default function requestApi(
  endpoint: string,
  method: string,
  body?: unknown,
  header?: Record<string, string>
) {
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  const headers = {
    ...defaultHeaders,
    ...header,
  };

  const instance = axios.create({ headers });

  // Attach the access token to every outgoing request.
  instance.interceptors.request.use(
    (config) => {
      const token = getStore(ACCESS_TOKEN);
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // On 401 try to renew the session once, otherwise send the user to login.
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (err: AxiosError) => {
      const originalRequest = err.config as RetriableRequest | undefined;
      const status = err.response?.status;

      if (status === 401 && originalRequest && !originalRequest._retried) {
        originalRequest._retried = true;

        const newToken = await refreshAccessToken();
        if (newToken) {
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          return instance.request(originalRequest);
        }

        clearTokens();
        window.location.href = "/login";
      }

      return Promise.reject(err);
    }
  );

  return instance.request({
    method: method,
    url: `${API_BASE_URL}/${endpoint}`,
    data: body,
  });
}
