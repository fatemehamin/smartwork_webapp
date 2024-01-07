import axios from "axios";
import axiosRetry from "axios-retry";
import jwtDecode from "jwt-decode";
import { getAccessToken, logout } from "../../features/auth/authSlice";

const baseURL = "https://smartbyhub.com/smart_time/api";
// const baseURL = "http://127.0.0.1:8000/api";
// const baseURL = "https://smartwork.backend.smartbyhub.com/api";

const axiosAPI = axios.create({ baseURL });

axiosRetry(axiosAPI, {
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  // retryCondition: () => true, // for all error
  retryCondition: (error) =>
    axiosRetry.isNetworkError(error) ||
    (error.response && error.response.status === 401),
});

let store;

export const injectStore = (_store) => {
  store = _store;
};

const checkTokenRequest = async (config) => {
  const { accessToken, refreshToken } = store.getState().auth;

  if (refreshToken) {
    if (jwtDecode(refreshToken).exp * 1000 <= new Date().getTime()) {
      store.dispatch(logout());
    } else if (
      accessToken === null ||
      jwtDecode(accessToken).exp * 1000 <= new Date().getTime()
    ) {
      try {
        const res = await axios.post(`${baseURL}/token/refresh/`, {
          refresh: refreshToken,
        });
        store.dispatch(getAccessToken(res.data.access));
      } catch (err) {
        console.log("refreshTokenError", err);
        store.dispatch(logout());
      }
    }

    const currentAccessToken = store.getState().auth.accessToken;
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }

  return config;
};

axiosAPI.interceptors.request.use(checkTokenRequest);

axiosAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw new Error(error);
  }
);

export default axiosAPI;
