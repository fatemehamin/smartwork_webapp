import { createSlice } from "@reduxjs/toolkit";
import {
  endTime,
  entry,
  exit,
  fetchNewTasksLog,
  fetchTasks,
  fetchTasksLog,
  startTime,
} from "./action";

const initialState = {
  tasks: [],
  currentTask: { name: "", start: 0 },
  taskLogList: [],
  isNewLog: false,
  isLoading: false,
  error: null,
  lastEntry: 0,
  permissionAutoExit: false,
  isAutoExit: false,
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,

  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setIsAutoExit: (state, action) => {
      state.isAutoExit = action.payload;
    },
    updateIsNewLog: (state, action) => {
      state.isNewLog = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.isLoading = false;
      state.currentTask = { name: "", start: 0 };
      state.tasks = action.payload.tasks.filter((project) => {
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

      state.lastEntry = action.payload.tasks.find(
        (project) => project.project_name === "entry"
      ).start_time;

      state.permissionAutoExit = action.payload.permissionAutoExit;
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
      const { isExitWithBoss, id } = action.payload;
      state.isLoading = false;
      state.lastEntry = isExitWithBoss ? state.lastEntry : 0;
      state.currentTask = isExitWithBoss
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
              today_duration: t.today_duration + action.payload.last_duration,
            }
          : t
      );
    });
    builder.addCase(endTime.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchTasksLog.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchTasksLog.fulfilled, (state, action) => {
      state.isLoading = false;
      state.taskLogList = action.payload;
    });
    builder.addCase(fetchTasksLog.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchNewTasksLog.fulfilled, (state, action) => {
      const { log, last_duration_task } = action.payload;
      state.taskLogList.push(log);
      state.isNewLog = !log.seen;
      if (log.project_name === "entry") {
        state.lastEntry = 0;
      } else {
        state.currentTask.start = 0;
        state.tasks = state.tasks.map((t) =>
          t.project_name === state.currentTask.name
            ? {
                ...t,
                today_duration:
                  t.today_duration + JSON.parse(last_duration_task),
              }
            : t
        );
      }
    });
  },
});
export const { setIsLoading, setIsAutoExit, updateIsNewLog } =
  tasksSlice.actions;
export default tasksSlice.reducer;
