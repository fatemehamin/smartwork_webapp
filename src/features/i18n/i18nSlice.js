import { createSlice } from "@reduxjs/toolkit";

const localStorageLang = localStorage.getItem("language");

const initialState = {
  language: localStorageLang ? localStorageLang : "EN",
  I18nManager: { isRTL: localStorageLang === "FA" },
  error: null,
  isLoading: false,
};

const i18nSlice = createSlice({
  name: "i18n",
  initialState,
  reducers: {
    changeLanguage: (state, action) => {
      localStorage.setItem("language", action.payload);
      state.language = action.payload;
      state.I18nManager = { isRTL: action.payload === "FA" };
    },
  },
});
export const { changeLanguage } = i18nSlice.actions;
export default i18nSlice.reducer;
