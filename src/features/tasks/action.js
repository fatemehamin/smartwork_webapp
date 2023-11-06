import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await axiosAPI.get("/project_state/");
  return {
    tasks: res.data["active projects"],
    permissionAutoExit: res.data.permissionAutoExit,
  };
});

export const entry = createAsyncThunk("tasks/entry", async () => {
  const res = await axiosAPI.put("/entry_exit/2525/");
  return res.data.entry_time;
});

export const exit = createAsyncThunk(
  "tasks/exit",
  async ({ phoneNumber, isExitWithBoss }) => {
    const res = await axiosAPI.patch("/entry_exit/2525/", {
      user_phone: phoneNumber,
    });
    return { isExitWithBoss, id: res.data.id };
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
    return { name, last_duration: res.data.last_duration, id: res.data.id };
  }
);

export const fetchTasksLog = createAsyncThunk(
  "tasks/fetchTasksLog",
  async () => {
    const res = await axiosAPI.get("/task_log/");
    return res.data.task_log_list;
  }
);

export const fetchNewTasksLog = createAsyncThunk(
  "tasks/fetchNewTasksLog",
  async ({ id, last_duration_task }) => {
    const res = await axiosAPI.get(`/task_log/${id}/`);
    return { log: res.data.task_log_list, last_duration_task };
  }
);
