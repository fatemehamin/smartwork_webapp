import axios from "axios";
import { getAccessToken, logout } from "../../features/auth/authSlice";
import jwtDecode from "jwt-decode";

// const baseURL = "https://smartbyhub.com/smart_time/api";
const baseURL = "http://127.0.0.1:8000/api";
// const baseURL = "https://smartwork.backend.smartbyhub.com/api";

const axiosAPI = axios.create({ baseURL });
let store;

export const injectStore = (_store) => {
  store = _store;
};

const checkTokenRequest = (config) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (accessToken !== null && refreshToken !== null) {
    if (jwtDecode(refreshToken).exp * 1000 <= new Date().getTime()) {
      store.dispatch(logout());
    } else if (jwtDecode(accessToken).exp * 1000 <= new Date().getTime()) {
      axios
        .post(`${baseURL}/token/refresh/`, { refresh: refreshToken })
        .then((res) => {
          store.dispatch(getAccessToken(res.data.access));
        })
        .catch((err) => console.log("refreshTokenError", err));
    }
    const currentAccessToken = localStorage.getItem("accessToken");
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  } else {
    store.dispatch(logout());
  }
  return config;
};

axiosAPI.interceptors.request.use(checkTokenRequest);

axiosAPI.interceptors.response.use(
  (response) => {
    return response;
  }
  // ,(error) => {    throw error  }
);

export default axiosAPI;
