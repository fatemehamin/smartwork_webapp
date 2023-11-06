import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchMsg = createAsyncThunk("msg/fetchMsg", async () => {
  const res = await axiosAPI.get("/msg/");
  return res.data.msg;
});

export const sendMsg = createAsyncThunk(
  "msg/sendMsg",
  async ({ from, to, msg, project }) => {
    const res = await axiosAPI.post("/msg/", {
      to_user: to,
      message: msg,
      project_name: project,
    });
    return { ...res.data, from, to, msg, project };
  }
);

export const deleteMsg = createAsyncThunk("msg/deleteMsg", async (id) => {
  await axiosAPI.delete(`/msg/${id}/`);
  return id;
});

export const changeStatusMsg = createAsyncThunk(
  "msg/changeStatusMsg",
  async ({ id, status }) => {
    await axiosAPI.put(`/msg/${id}/${status}/`);
    return { id, status };
  }
);

export const fetchNewMsg = createAsyncThunk(
  "msg/fetchNewMsg",
  async ({ id, type }) => {
    const res = await axiosAPI.get(`/msg/${id}/`);
    return { msg: res.data.msg, type };
  }
);
