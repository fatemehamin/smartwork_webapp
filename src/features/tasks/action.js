import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await axiosAPI.get("/project_state/");
  return res.data["active projects"];
});

export const entry = createAsyncThunk("tasks/entry", async () => {
  const res = await axiosAPI.put("/entry_exit/2525/");
  return res.data.entry_time;
});

export const exit = createAsyncThunk(
  "tasks/exit",
  async ({ phoneNumber, isExitWithBoss }) => {
    await axiosAPI.patch("/entry_exit/2525/", { user_phone: phoneNumber });
    return isExitWithBoss;
  }
);

export const startTime = createAsyncThunk(
  "tasks/startTime",
  async (project_name) => {
    const res = await axiosAPI.put("/project_state/", { project_name });
    return { name: project_name, start: res.data.start_time };
  }
);

export const endTime = createAsyncThunk(
  "tasks/endTime",
  async ({ name, phoneNumber }) => {
    const res = await axiosAPI.patch("/project_state/", {
      project_name: name,
      user_phone: phoneNumber,
    });
    return { name, last_duration: res.data.last_duration };
  }
);

export const fetchTasksLog = createAsyncThunk(
  "tasks/fetchTasksLog",
  async () => {
    const res = await axiosAPI.get("/task_log/");
    return res.data.task_log_list;
  }
);

export const fetchIsNewLog = createAsyncThunk(
  "tasks/fetchIsNewLog",
  async () => {
    const res = await axiosAPI.get("/is_new_log/");
    return res.data.isNewTaskLog;
  }
);
