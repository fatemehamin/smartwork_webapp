import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import i18nReducer from "../features/i18n/i18nSlice";
import authReducer from "../features/auth/authSlice";
import usersReducer from "../features/users/usersSlice";
import projectsReducer from "../features/projects/projectsSlice";
import locationsReducer from "../features/locations/locationsSlice";
import tasksReducer from "../features/tasks/tasksSlice";
import reportsReducer from "../features/reports/reportsSlice";
import msgReducer from "../features/msg/msgSlice";
import leaveRequestReducer from "../features/leaveRequests/leaveRequestSlice";
import configReducer from "../features/config/configSlice";
import notificationReducer from "../features/notification/notificationSlice";
import shiftWorkReducer from "../features/shiftWork/shiftWorkSlice";

const combineReducer = combineReducers({
  i18n: i18nReducer,
  auth: authReducer,
  users: usersReducer,
  projects: projectsReducer,
  locations: locationsReducer,
  tasks: tasksReducer,
  reports: reportsReducer,
  msg: msgReducer,
  leaveRequest: leaveRequestReducer,
  config: configReducer,
  notification: notificationReducer,
  shift: shiftWorkReducer,
});

const rootReducer = (state, action) => {
  if (state?.auth?.isAuthentication && action.type === "auth/logout") {
    const { userInfo } = state.auth;
    const { i18n } = state;
    state = {
      auth: {
        userInfo,
        type: null,
        accessToken: null,
        refreshToken: null,
        isAuthentication: false,
        error: null,
        isLoading: false,
      },
      i18n,
    }; // clear all state except auth and i18n
    // state = undefined; //clear all state
  }
  return combineReducer(state, action);
};

const persistConfig = { key: "root", storage };

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export const persistor = persistStore(store);
