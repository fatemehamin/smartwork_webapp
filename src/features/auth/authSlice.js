import { createSlice } from "@reduxjs/toolkit";
import {
  checkType,
  createUserLoading,
  forgotPassword,
  login,
  phoneNumberCheck,
  verifyCode,
} from "./action";

const accessToken = localStorage.getItem("accessToken");
const refreshToken = localStorage.getItem("refreshToken");
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const type = localStorage.getItem("type");

const initialState = {
  userInfo,
  type,
  accessToken,
  refreshToken,
  isAuthentication: accessToken != null,
  error: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.clear();
    },
    getAccessToken: (state, action) => {
      localStorage.setItem("accessToken", action.payload);
      state.accessToken = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { access, refresh, userInfo, type } = action.payload;
      state.isLoading = false;
      state.accessToken = access;
      state.refreshToken = refresh;
      state.isAuthentication = true;
      state.userInfo = { ...state.userInfo, ...userInfo };
      state.type = type;
      localStorage.setItem("type", type);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("accessToken", access);
      localStorage.setItem("userInfo", JSON.stringify(state.userInfo));
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(checkType.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkType.fulfilled, (state, action) => {
      state.isLoading = false;
      state.type = action.payload;
      localStorage.setItem("type", action.payload);
    });
    builder.addCase(checkType.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(phoneNumberCheck.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(phoneNumberCheck.fulfilled, (state) => {
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(phoneNumberCheck.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message.slice(-3) === "406"
          ? "phoneNumberExists"
          : action.error.message;
    });
    builder.addCase(createUserLoading.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(createUserLoading.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = action.payload;
    });
    builder.addCase(createUserLoading.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(forgotPassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = { ...state.userInfo, ...action.payload };
    });
    builder.addCase(forgotPassword.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(verifyCode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyCode.fulfilled, (state) => {
      state.isLoading = false;
      localStorage.setItem(
        "userInfo",
        // don't save password for security
        JSON.stringify({ ...state.userInfo, password: null })
      );
    });
    builder.addCase(verifyCode.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const { logout, getAccessToken } = authSlice.actions;
export default authSlice.reducer;
