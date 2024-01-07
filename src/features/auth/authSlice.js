import { createAction, createSlice } from "@reduxjs/toolkit";
import {
  changePassword,
  checkType,
  createUserLoading,
  forgotPassword,
  login,
  phoneNumberCheck,
  verifyCode,
} from "./action";

const initialState = {
  userInfo: {
    callingCode: "+98",
    country: "IR",
    phoneNumber: "+98",
  },
  type: null,
  accessToken: null,
  refreshToken: null,
  isAuthentication: false,
  error: null,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    getAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    updateUser: (state, action) => {
      state.userInfo = action.payload;
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
      state.userInfo = userInfo;
      state.type = type;
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
      state.userInfo = action.payload;
    });
    builder.addCase(forgotPassword.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(verifyCode.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(verifyCode.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = { ...state.userInfo, ...action.payload };
    });
    builder.addCase(verifyCode.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userInfo = { ...state.userInfo, ...action.payload };
    });
    builder.addCase(changePassword.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const { getAccessToken, updateUser } = authSlice.actions;
export const logout = createAction("auth/logout");
export default authSlice.reducer;
