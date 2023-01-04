import {
  LOADING,
  LOADED,
  ERROR,
  PHONE_NUMBER_ERROR,
  CREATE_USER_LOADING,
  CREATE_USER_ERROR,
  UPDATE_USER,
  LOGIN,
  LOGOUT,
  ACCESS_TOKEN,
} from "./actionType";
import axios from "../../services/API/index";

// -------------------------------------- init -------------------------------------- //
export const init = () => {
  return async (dispatch) => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const phoneNumber = localStorage.getItem("phoneNumber");
    const callingCode = localStorage.getItem("callingCode");
    const password = localStorage.getItem("password"); //password should be secure
    const type = localStorage.getItem("type");
    dispatch({
      type: LOGIN,
      payload: {
        accessToken,
        refreshToken,
        user: { callingCode, phoneNumber, password },
        type: type,
      },
    });
  };
};
// ------------------------------- phoneNumber check ------------------------------- //
export const phoneNumberCheck = (phoneNumber) => {
  return (dispatch) => {
    axios
      .post("/user_check_is_exists/", { username: phoneNumber })
      .then((res) =>
        dispatch({
          type: LOADED,
        })
      )
      .catch((err) => {
        dispatch({
          type: PHONE_NUMBER_ERROR,
          payload: {
            phoneNumberError:
              err.response.status === 406
                ? "This phone number exists in the system."
                : `Error ${err.response.data}`,
          },
        });
      });
  };
};
// ------------------------------ create user loading ------------------------------ //
export const createUserLoading = (
  firstName,
  lastName,
  companyName,
  country,
  callingCode,
  phoneNumber,
  email,
  password,
  navigate
) => {
  return (dispatch) => {
    // when "send again code" pressed button don't go loading mode
    navigate !== undefined && dispatch({ type: LOADING });
    axios
      .post("/send_email/", { company: companyName, phone_number: phoneNumber })
      .then((res) => {
        dispatch({
          type: CREATE_USER_LOADING,
          payload: {
            firstName,
            lastName,
            companyName,
            country,
            callingCode,
            phoneNumber,
            email,
            password,
          },
        });
        //signup: when navigate is undefined, it's meaning button "send again code" pressed
        navigate !== undefined &&
          navigate(`/verifyCode/${phoneNumber}/createUser`);
      })
      .catch((err) => {
        dispatch({
          type: CREATE_USER_ERROR,
          payload: {
            existsCompanyError:
              err.response.status === 406
                ? "This company name exists in the system."
                : `Error ${err.response.data}`,
          },
        });
      });
  };
};
// ---------------------------------- verify code ---------------------------------- //
export const verifyCode = (
  code,
  email,
  firstName,
  lastName,
  companyName,
  password,
  country,
  callingCode,
  phoneNumber,
  navigate,
  type
) => {
  return (dispatch) => {
    dispatch({ type: LOADING });
    axios
      .post("/verify_email/", { phone_number: phoneNumber, code })
      .then((res) => {
        // when signup: from verify code go to login screen
        if (type === "createUser") {
          axios
            .post("/register/", {
              first_name: firstName,
              last_name: lastName,
              company: companyName,
              email,
              password,
              phone_number: phoneNumber,
              country_code: callingCode,
            })
            .then((resp) => {
              dispatch({
                type: CREATE_USER_LOADING,
                payload: {
                  firstName,
                  lastName,
                  companyName,
                  email,
                  password,
                  country,
                  callingCode,
                  phoneNumber,
                },
              });
              navigate("/login");
            })
            .catch((error) =>
              dispatch({
                type: ERROR,
                payload: `Error ${error.response.data}`,
              })
            );
          // when forgotPassword: from verify code go to changePassword screen
        } else {
          dispatch({ type: LOADED });
          navigate("/changePassword");
        }
      })
      .catch((err) => {
        dispatch({
          type: ERROR,
          payload:
            err.response.status === 401
              ? "verify code is incorrect."
              : `Error ${err.response.data}`,
        });
      });
  };
};
// -------------------------------- forgot password -------------------------------- //
export const forgotPassword = (username, navigate) => {
  return (dispatch) => {
    dispatch({ type: LOADING });
    axios
      .post("/forgot_password/", { username })
      .then((res) => {
        dispatch({
          type: UPDATE_USER,
          payload: { username },
        });
        //forgotPassword: when navigate is undefined, it's meaning button "send again code" pressed
        navigate !== undefined &&
          navigate(`/verifyCode/${username}/forgotPassword`);
      })
      .catch((err) => {
        dispatch({
          type: ERROR,
          payload:
            err.response.status === 404
              ? "Phone number not exists."
              : `Error ${err.response.data}`,
        });
      });
  };
};
// -------------------------------- change password -------------------------------- //
export const ChangePassword = (username, password, navigate) => {
  return (dispatch) => {
    dispatch({ type: LOADING });
    axios
      .patch("/forgot_password/", { username, password })
      .then((res) => {
        dispatch({ type: UPDATE_USER, payload: { password } });
        navigate("/login");
      })
      .catch((err) => {
        dispatch({
          type: ERROR,
          payload: "Password not changed. Please try again.",
        });
      });
  };
};
// ------------------------------------- login ------------------------------------- //
export const login = (
  country,
  callingCode,
  phoneNumber,
  password,
  navigate
) => {
  return async (dispatch) => {
    try {
      if (phoneNumber === callingCode && password === "") {
        dispatch({
          type: ERROR,
          payload: "Please enter your username or password.",
        });
      } else {
        dispatch({ type: LOADING });
        const res = await axios.post("/token/", {
          username: phoneNumber,
          password,
        });
        const { access, refresh } = res.data;
        localStorage.setItem("refreshToken", refresh);
        localStorage.setItem("accessToken", access);
        localStorage.setItem("phoneNumber", phoneNumber);
        localStorage.setItem("callingCode", callingCode);
        localStorage.setItem("password", password); // password isn't secure
        const type = await axios.get("/check_state/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        localStorage.setItem("type", type.data.place);
        dispatch({
          type: LOGIN,
          payload: {
            accessToken: access,
            refreshToken: refresh,
            user: { country, callingCode, phoneNumber, password },
            type: type.data.place,
          },
        });
        type.data.place === "boss"
          ? navigate("/manager")
          : navigate("/myTasks");
      }
    } catch (err) {
      dispatch({
        type: ERROR,
        payload:
          err.response.status === 401
            ? "Username or password is incorrect."
            : `Error ${err.response.data}`,
      });
    }
  };
};
// ------------------------------------- logout ------------------------------------- //
export const logout = (navigate) => {
  return async (dispatch) => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("type");
    localStorage.removeItem("projectNow");
    localStorage.removeItem("startTime");
    localStorage.removeItem("entry");
    dispatch({ type: LOGOUT });
    navigate("/login");
  };
};
// ---------------------------------- access token ---------------------------------- //
export const accessToken = (accessToken) => {
  return async (dispatch) => {
    localStorage.setItem("accessToken", accessToken);
    dispatch({ type: ACCESS_TOKEN, payload: accessToken });
  };
};
// ---------------------------------- refresh token ---------------------------------- //
export const refreshToken = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
  };
};
