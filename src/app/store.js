import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
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
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    state = undefined;
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
