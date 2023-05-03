import axios from "axios";
import { store } from "../../redux/store/index";
import { accessToken, logout } from "../../redux/action/authAction";
import jwtDecode from "jwt-decode";
import { getProject } from "../../redux/action/employeeAction";
import { getEmployee } from "../../redux/action/managerAction";

// const baseURL = "https://smartbyhub.com/smart_time/api";
const baseURL = "http://127.0.0.1:8000/api";
// const baseURL = "https://smartwork.backend.smartbyhub.com/api";

const axiosAPI = axios.create({ baseURL });

axiosAPI.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      jwtDecode(store.getState().authReducer.refreshToken).exp * 1000 <=
      new Date().getTime()
    ) {
      store.dispatch(logout());
    } else if (
      jwtDecode(store.getState().authReducer.accessToken).exp * 1000 <=
      new Date().getTime()
    ) {
      const refreshToken = store.getState().authReducer.refreshToken;
      if (refreshToken != null) {
        axiosAPI
          .post("/token/refresh/", { refresh: refreshToken })
          .then((res) =>
            store.dispatch(
              accessToken(res.data.access, () =>
                store.getState().authReducer.type === "boss"
                  ? store.getState().managerReducer.employees.length <= 0 &&
                    store.dispatch(getEmployee())
                  : store.getState().employeeReducer.projects.length <= 0 &&
                    store.dispatch(getProject())
              )
            )
          )
          .catch((err) => console.log("refreshTokenError", err));
      }
    }
  }
);

export default axiosAPI;
