import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const addFcmToken = createAsyncThunk(
  "notification/addFcmToken",
  async ({ fcm_token, model }) => {
    const res = await axiosAPI.post("/notification/", { fcm_token, model });
    return res.data.id;
  }
);

export const deleteFcmToken = createAsyncThunk(
  "notification/deleteFcmToken",
  async (id) => {
    await axiosAPI.delete(`/notification/${id}/`);
  }
);

export const sendNotification = createAsyncThunk(
  "notification/sendNotification",
  async ({
    to,
    msg,
    project,
    typeNotification,
    id_data,
    lastDurationTask,
    request,
  }) => {
    await axiosAPI.put("/notification/", {
      to_user: to,
      message: msg,
      project_name: project,
      type_Notification: typeNotification,
      id_data,
      last_duration_task: lastDurationTask,
      request,
    });
    return { to, msg, project };
  }
);
