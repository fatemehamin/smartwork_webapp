import axios from "axios";
import { getAccessToken, logout } from "../../features/auth/authSlice";
import jwtDecode from "jwt-decode";
import { fetchUsers } from "../../features/users/action";
import { fetchProject } from "../../features/projects/action";

const baseURL = "https://smartbyhub.com/smart_time/api";
// const baseURL = "http://127.0.0.1:8000/api";
// const baseURL = "https://smartwork.backend.smartbyhub.com/api";

const axiosAPI = axios.create({ baseURL });

export const injectStore = (store) => {
  axiosAPI.interceptors.request.use((config) => {
    const { accessToken, refreshToken, isAuthentication } =
      store.getState().auth;
    console.log(jwtDecode(accessToken).exp * 1000 <= new Date().getTime());
    if (isAuthentication) {
      if (jwtDecode(refreshToken).exp * 1000 <= new Date().getTime()) {
        store.dispatch(logout());
      } else if (jwtDecode(accessToken).exp * 1000 <= new Date().getTime()) {
        axiosAPI
          .post("/token/refresh/", { refresh: refreshToken })
          .then((res) => {
            store.dispatch(getAccessToken(res.data.access));
            store.getState().auth.type === "boss"
              ? store.getState().users.users.length <= 0 &&
                store.dispatch(fetchUsers())
              : store.getState().projects.projects.length <= 0 &&
                store.dispatch(fetchProject());
          })
          .catch((err) => console.log("refreshTokenError", err));
      }

      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  axiosAPI.interceptors.response.use((response) => {
    return response;
  });
};

export default axiosAPI;
