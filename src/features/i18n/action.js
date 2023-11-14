import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const getLanguage = createAsyncThunk("i18n/getLanguage", async () => {
  const res = await axiosAPI.get("/language/");
  return res.data.language;
});

export const changeLanguage = createAsyncThunk(
  "i18n/changeLanguage",
  async (language) => {
    await axiosAPI.put("/language/", { language });
    return language;
  }
);
