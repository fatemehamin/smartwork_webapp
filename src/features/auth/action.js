import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const login = createAsyncThunk(
  "auth/login",
  async ({ country, callingCode, phoneNumber, password }) => {
    const res = await axiosAPI.post("/token/", {
      username: phoneNumber === callingCode ? "" : phoneNumber,
      password,
    });
    const type = await axiosAPI.get("/check_state/", {
      headers: {
        Authorization: `Bearer ${res.data.access}`,
      },
    });
    return {
      ...res.data,
      type: type.data.place,
      userInfo: { country, callingCode, phoneNumber },
    };
  }
);

export const phoneNumberCheck = createAsyncThunk(
  "auth/phoneNumberCheck",
  async (phoneNumber) => {
    await axiosAPI.post("/user_check_is_exists/", {
      username: phoneNumber,
    });
  }
);

export const createUserLoading = createAsyncThunk(
  "auth/createUserLoading",
  async ({
    firstName,
    lastName,
    companyName,
    country,
    callingCode,
    phoneNumber,
    password,
  }) => {
    await axiosAPI.post("/send_email/", {
      company: companyName,
      phone_number: phoneNumber,
    });
    return {
      firstName,
      lastName,
      companyName,
      country,
      callingCode,
      phoneNumber,
      password,
    };
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ callingCode, phoneNumber, country }) => {
    await axiosAPI.post("/forgot_password/", {
      username: phoneNumber,
    });
    return { country, callingCode, phoneNumber };
  }
);

export const verifyCode = createAsyncThunk(
  "auth/verifyCode",
  async ({ type, code, userInfo }) => {
    await axiosAPI.post("/verify_email/", {
      phone_number: userInfo.phoneNumber,
      code,
    });

    type === "createUser" && // when signup
      (await axiosAPI.post("/register/", {
        first_name: userInfo.firstName,
        last_name: userInfo.lastName,
        company: userInfo.companyName,
        email: userInfo.email,
        password: userInfo.password,
        phone_number: userInfo.phoneNumber,
        country_code: userInfo.country + userInfo.callingCode,
      }));
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ username, password }) => {
    await axiosAPI.patch("/forgot_password/", { username, password });
    return {};
  }
);
