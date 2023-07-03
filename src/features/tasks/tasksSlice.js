import { createSlice } from "@reduxjs/toolkit";
import { endTime, entry, exit, fetchTasks, startTime } from "./action";

const initialState = {
  tasks: [],
  currentTask: { name: "", start: 0 },
  isLoading: false,
  error: null,
  lastEntry: 0,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentTask = { name: "", start: 0 };
      state.tasks = action.payload.filter((project) => {
        if (project.project_name !== "entry" && project.start_time) {
          state.currentTask = {
            name: project.project_name,
            start: project.start_time,
            duration: project.duration,
            today_duration: project.today_duration,
          };
        }
        return project.project_name !== "entry";
      });
      state.lastEntry = action.payload.find(
        (project) => project.project_name === "entry"
      ).start_time;
    });
    builder.addCase(fetchTasks.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(entry.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(entry.fulfilled, (state, action) => {
      state.isLoading = false;
      state.lastEntry = action.payload;
    });
    builder.addCase(entry.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(exit.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(exit.fulfilled, (state, action) => {
      state.isLoading = false;
      state.lastEntry = action.payload ? state.lastEntry : 0;
      state.currentTask = action.payload
        ? state.currentTask
        : { name: "", start: 0 };
    });
    builder.addCase(exit.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(startTime.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(startTime.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentTask = action.payload;
      state.tasks = state.tasks.map((t) =>
        t.project_name === action.payload.name
          ? { ...t, startTime: action.payload.start }
          : t
      );
    });
    builder.addCase(startTime.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(endTime.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(endTime.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentTask = { name: action.payload.name, start: 0 };
      state.tasks = state.tasks.map((t) =>
        t.project_name === action.payload.name
          ? {
              ...t,
              duration: t.duration + parseInt(action.payload.last_duration),
            }
          : t
      );
    });
    builder.addCase(endTime.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const { setIsLoading } = tasksSlice.actions;
export default tasksSlice.reducer;