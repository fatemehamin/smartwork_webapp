import { createSlice } from "@reduxjs/toolkit";
import { changeLanguage, getLanguage } from "./action";

const initialState = {
  language: "EN",
  I18nManager: { isRTL: false },
  error: null,
  isLoading: false,
};

const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(getLanguage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getLanguage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.language = action.payload;
      state.I18nManager = { isRTL: action.payload === "FA" };
    });
    builder.addCase(getLanguage.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(changeLanguage.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeLanguage.fulfilled, (state, action) => {
      state.isLoading = false;
      state.language = action.payload;
      state.I18nManager = { isRTL: action.payload === "FA" };
    });
    builder.addCase(changeLanguage.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export default i18nSlice.reducer;
