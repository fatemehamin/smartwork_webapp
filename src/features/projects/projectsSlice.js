import { createSlice } from "@reduxjs/toolkit";
import {
  addProjects,
  deleteProject,
  editProject,
  fetchProject,
} from "./action";

const initialState = {
  projects: [],
  isLoading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projects = action.payload === "pdne" ? [] : action.payload;
    });
    builder.addCase(fetchProject.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addProjects.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProjects.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.projects.push(action.payload);
    });
    builder.addCase(addProjects.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message;
    });
    builder.addCase(deleteProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projects = state.projects.filter(
        (p) => p.project_name !== action.payload
      );
    });
    builder.addCase(deleteProject.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(editProject.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editProject.fulfilled, (state, action) => {
      state.isLoading = false;
      state.projects = state.projects.map((p) =>
        p.project_name === action.payload.oldProjectName
          ? { ...p, project_name: action.payload.newProjectName }
          : p
      );
    });
    builder.addCase(editProject.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default projectsSlice.reducer;
