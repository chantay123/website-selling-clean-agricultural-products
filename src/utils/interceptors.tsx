import axios from "axios";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  clearCookie,
  clearStore,
  getCookie,
  getStore,
} from "./setting";

export default function requestApi(
  endpoint: string,
  method: string,
  body: any,
  header?: any
) {
  const defaultHeaders = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  const headers = {
    ...defaultHeaders,
    ...header,
  };
  const instance = axios.create({ headers });

  // set up send request
  instance.interceptors.request.use(
    (config: any) => {
      const token = getStore(ACCESS_TOKEN);
      if (token) {
        config.headers = {
          ...config.headers,
          ["Authorization"]: `Bearer ${token}`,
        };
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // set up receive response
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (err) => {
      const access = getStore(ACCESS_TOKEN);
      const refresh = getCookie(REFRESH_TOKEN);
      //access token expires => status code 401
      if (err.response && err.response.status === 401 && refresh && access) {
        try {
          clearStore(ACCESS_TOKEN);
          clearCookie(REFRESH_TOKEN);
          window.location.href = "/login";
          //save new AT & RT into storage
        } catch (error: any) {
          if (error?.response?.status === 404) {
            clearStore(ACCESS_TOKEN);
            clearCookie(REFRESH_TOKEN);
            window.location.href = "/login";
          }
          return Promise.reject(error);
        }
      }
      return Promise.reject(err);
    }
  );

  return instance.request({
    method: method,
    url: `http://localhost:3000/${endpoint}`,
    data: body,
  });
}
