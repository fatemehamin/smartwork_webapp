import {
  LOADING,
  LOADED,
  ERROR,
  CREATE_USER_LOADING,
  UPDATE_USER,
  LOGIN,
  LOGOUT,
  ACCESS_TOKEN,
} from "./actionType";
import axios from "../../services/API/index";
// import snackbar from "react-native-snackbar";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------------------------- init -------------------------------------- //
export const init = () => {
  return async (dispatch) => {
    // const accessToken = await AsyncStorage.getItem("accessToken");
    // const refreshToken = await AsyncStorage.getItem("refreshToken");
    // const phoneNumber = await AsyncStorage.getItem("phoneNumber");
    // const callingCode = await AsyncStorage.getItem("callingCode");
    // const password = await AsyncStorage.getItem("password");
    // const type = await AsyncStorage.getItem("type");
    // dispatch({
    //   type: LOGIN,
    //   payload: {
    //     accessToken,
    //     refreshToken,
    //     user: { callingCode, phoneNumber, password },
    //     type: type,
    //   },
    // });
  };
};
// ------------------------------- phoneNumber check ------------------------------- //
export const phoneNumberCheck = (phoneNumber) => {
  return (dispatch) => {
    axios
      .post("/user_check_is_exists/", { username: phoneNumber })
      // without log don't work
      .then((res) => console.log(res.status))
      .catch((err) => {
        dispatch({
          type: ERROR,
          payload: {
            phoneNumberError: "This phone number exists in the system.",
          },
        });
      });
    dispatch({ type: LOADED });
  };
};
// ------------------------------ create user loading ------------------------------ //
export const createUserLoading = (
  firstName,
  lastName,
  companyName,
  callingCode,
  phoneNumber,
  email,
  password,
  navigation
) => {
  return (dispatch) => {
    // when "send again code" pressed button don't go loading mode
    navigation !== undefined && dispatch({ type: LOADING });
    axios
      .post("/send_email/", { company: companyName, email })
      .then((res) => {
        // without log don't work
        console.log(res.status);
        dispatch({
          type: CREATE_USER_LOADING,
          payload: {
            firstName,
            lastName,
            companyName,
            callingCode,
            phoneNumber,
            email,
            password,
          },
        });
        //signup: when navigation is undefined, it's meaning button "send again code" pressed
        navigation !== undefined &&
          navigation.navigate("VerifyCode", { email, type: "createUser" });
      })
      .catch((err) => {
        // snackbar.show({ text: "This company name exists in the system." });
        dispatch({ type: LOADED });
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
  callingCode,
  phoneNumber,
  navigation,
  type
) => {
  return (dispatch) => {
    dispatch({ type: LOADING });
    axios
      .post("/verify_email/", { email, code })
      .then((res) => {
        // without log don't work
        console.log(res.status);
        // when signup: from verify code go to login screen
        if (type == "createUser") {
          axios
            .post("/register/", {
              first_name: firstName,
              last_name: lastName,
              company: companyName,
              email,
              password,
              phone_number: phoneNumber,
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
                  callingCode,
                  phoneNumber,
                },
              });
              navigation.navigate("Login");
            })
            .catch((error) => dispatch({ type: LOADED }));
          // when forgotPassword: from verify code go to changePassword screen
        } else {
          dispatch({ type: LOADED });
          navigation.navigate("ChangePassword");
        }
      })
      .catch((err) => {
        // snackbar.show({ text: "verify code is incorrect." });
        dispatch({ type: LOADED });
      });
  };
};
// -------------------------------- forgot password -------------------------------- //
export const forgotPassword = (username, navigation) => {
  return (dispatch) => {
    dispatch({ type: LOADING });
    axios
      .post("/forgot_password/", { username })
      .then((res) => {
        dispatch({
          type: UPDATE_USER,
          payload: { username, email: res.data.email },
        });
        //forgotPassword: when navigation is undefined, it's meaning button "send again code" pressed
        navigation !== undefined &&
          navigation.navigate("VerifyCode", {
            email: res.data.email,
            type: "forgotPassword",
          });
      })
      .catch((err) => {
        // snackbar.show({ text: "Phone number not exists." });
        dispatch({ type: LOADED });
      });
  };
};
// -------------------------------- change password -------------------------------- //
export const ChangePassword = (username, password, navigation) => {
  return (dispatch) => {
    dispatch({ type: LOADING });
    axios
      .patch("/forgot_password/", { username, password })
      .then((res) => {
        dispatch({ type: UPDATE_USER, payload: { password } });
        navigation.navigate("Login");
      })
      .catch((err) => {
        dispatch({ type: LOADED });
        // snackbar.show({ text: "Password not changed. Please try again." });
      });
  };
};
// ------------------------------------- login ------------------------------------- //
export const login = (callingCode, phoneNumber, password) => {
  return async (dispatch) => {
    try {
      if (phoneNumber == "" && password == "") {
        console.log("gg");
        // snackbar.show({
        //   text: "Please enter your username or password.",
        // });
      } else {
        dispatch({ type: LOADING });
        const res = await axios.post("/token/", {
          username: phoneNumber,
          password,
        });
        const { access, refresh } = res.data;
        // await AsyncStorage.setItem('refreshToken', refresh);
        // await AsyncStorage.setItem('accessToken', access);
        // await AsyncStorage.setItem('phoneNumber', phoneNumber);
        // await AsyncStorage.setItem('callingCode', callingCode);
        // await AsyncStorage.setItem('password', password);
        const type = await axios.get("/check_state/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        // await AsyncStorage.setItem("type", type.data.place);
        dispatch({
          type: LOGIN,
          payload: {
            accessToken: access,
            refreshToken: refresh,
            user: { callingCode, phoneNumber, password },
            type: type.data.place,
          },
        });
      }
    } catch (err) {
      dispatch({ type: LOADED });
      // snackbar.show({ text: "Username or password is incorrect." });
    }
  };
};
// ------------------------------------- logout ------------------------------------- //
export const logout = () => {
  return async (dispatch) => {
    // await AsyncStorage.removeItem("accessToken");
    // await AsyncStorage.removeItem("refreshToken");
    // await AsyncStorage.removeItem("type");
    // await AsyncStorage.removeItem("projectNow");
    // await AsyncStorage.removeItem("startTime");
    // await AsyncStorage.removeItem("entry");
    dispatch({ type: LOGOUT });
  };
};
// ---------------------------------- access token ---------------------------------- //
export const accessToken = (accessToken) => {
  return async (dispatch) => {
    // await AsyncStorage.setItem("accessToken", accessToken);
    dispatch({ type: ACCESS_TOKEN, payload: accessToken });
  };
};
// ---------------------------------- refresh token ---------------------------------- //
export const refreshToken = () => {
  return (dispatch) => {
    dispatch({ type: LOGOUT });
  };
};
