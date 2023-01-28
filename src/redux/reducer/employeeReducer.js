import {
  LOADING_EMPLOYEE,
  LOADED_EMPLOYEE,
  ERROR_EMPLOYEE,
  END_TIME,
  START_TIME,
  GET_TASKS_EMPLOYEE,
  REPORT,
  DAILY_REPORT,
  ENTRY,
  EXIT,
  LOCATION,
  LOGOUT,
} from "../action/actionType";

const initialState = {
  projects: null,
  currentTask: {
    name: "",
    start: 0,
  },
  isError: false,
  isLoading: false,
  error: null,
  report: null,
  reportInMonth: null,
  dailyReport: { dailyReport: "", date: "" },
  lastEntry: 0,
  locations: [],
};
export default (preState = initialState, action) => {
  switch (action.type) {
    case LOADING_EMPLOYEE: {
      return { ...preState, isLoading: true, isError: false, error: null };
    }
    case LOADED_EMPLOYEE: {
      return { ...preState, isLoading: false, isError: false, error: null };
    }
    case ERROR_EMPLOYEE: {
      return {
        ...preState,
        isLoading: false,
        isError: true,
        error: action.payload,
      };
    }
    case GET_TASKS_EMPLOYEE: {
      const { data, dailyReport, startTime } = action.payload;
      let entry = 0;
      let newCurrentTask = {
        name: "",
        start: 0,
      };
      const newProject =
        data === undefined
          ? null
          : data
              .filter((project) => {
                entry =
                  project.project_name === "entry" ? project.start_time : 0;
                return project.project_name !== "entry";
              })
              .map((project) => {
                if (project.start_time) {
                  newCurrentTask = {
                    name: project.project_name,
                    start:
                      startTime !== null // if start time storage in phone delete and be null give start time data base
                        ? parseInt(startTime)
                        : project.start_time,
                  };
                }
                return {
                  project_name: project.project_name,
                  startTime: parseInt(project.start_time),
                  endTime: 0,
                  duration: parseInt(project.today_duration),
                };
              });
      const todayDate = new Date().toISOString().slice(0, 10);
      return {
        ...preState,
        projects: newProject,
        currentTask: newCurrentTask,
        isError: false,
        isLoading: false,
        error: null,
        dailyReport:
          dailyReport != null && todayDate === dailyReport.date
            ? dailyReport
            : { dailyReport: "", date: "" },
        lastEntry: entry,
      };
    }
    case START_TIME: {
      const { project_name, startTime } = action.payload;
      const newProjects = preState.projects.map((project) =>
        project.project_name === project_name
          ? { ...project, startTime: startTime }
          : project
      );
      return {
        ...preState,
        projects: newProjects,
        isError: false,
        error: null,
        isLoading: false,
        currentTask: {
          name: project_name,
          start: startTime,
        },
      };
    }
    case END_TIME: {
      const { project_name, last_duration } = action.payload;
      const newProjects = preState.projects.map((project) =>
        project.project_name === project_name
          ? {
              ...project,
              duration: project.duration + parseInt(last_duration),
            }
          : project
      );
      return {
        ...preState,
        projects: newProjects,
        isError: false,
        error: null,
        isLoading: false,
        currentTask: {
          name: project_name,
          start: 0,
        },
      };
    }
    case REPORT: {
      const { reports, reportInMonth } = action.payload;
      return {
        ...preState,
        isError: false,
        error: null,
        isLoading: false,
        report: reports,
        reportInMonth:
          reportInMonth !== undefined ? reportInMonth : preState.reportInMonth,
      };
    }
    case DAILY_REPORT: {
      return {
        ...preState,
        isLoading: false,
        isError: false,
        error: null,
        dailyReport: action.payload,
      };
    }
    case ENTRY: {
      return {
        ...preState,
        isLoading: false,
        isError: false,
        error: null,
        lastEntry: action.payload,
      };
    }
    case EXIT: {
      return {
        ...preState,
        isLoading: false,
        isError: false,
        error: null,
        lastEntry: 0,
      };
    }
    case LOCATION: {
      return {
        ...preState,
        locations: action.payload,
        isLoading: false,
        isError: false,
        error: null,
      };
    }
    case LOGOUT: {
      return initialState;
    }
    default: {
      return preState;
    }
  }
};
