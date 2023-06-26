import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchProject = createAsyncThunk(
  "projects/fetchProject",
  async () => {
    const res = await axiosAPI.get("/project_register/");
    return res.data.detail;
  }
);

export const addProjects = createAsyncThunk(
  "projects/addProjects",
  async (project_name) => {
    await axiosAPI.put("/project_register/", { project_name });
    return { project_name, sum_duration: 0 };
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (project_name) => {
    await axiosAPI.delete("/project_register/", { data: { project_name } });
    return project_name;
  }
);

export const editProject = createAsyncThunk(
  "projects/editProject",
  async ({ oldProjectName, newProjectName }) => {
    await axiosAPI.patch(`/project_register/`, {
      oldProjectName,
      newProjectName,
    });
    return { oldProjectName, newProjectName };
  }
);
