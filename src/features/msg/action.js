import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchMsg = createAsyncThunk("msg/fetchMsg", async () => {
  const res = await axiosAPI.get("/msg/");
  return res.data.msg;
});

export const sendMsg = createAsyncThunk("msg/sendMsg", async () => {
  // const res = await axiosAPI.get("/msg/");
  // return res.data.msg;
});

export const deleteMsg = createAsyncThunk("msg/deleteMsg", async (id) => {
  await axiosAPI.delete(`/msg/${id}/`);
  return id;
});

export const changeStatus = createAsyncThunk(
  "msg/changeStatus",
  async ({ id, status }) => {
    await axiosAPI.put(`/msg/${id}/${status}/`);
    return { id, status };
  }
);
