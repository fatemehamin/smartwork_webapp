import { combineReducers } from "redux";
import authReducer from "./authReducer";
import managerReducer from "./managerReducer";
import employeeReducer from "./employeeReducer";
import configReducer from "./configReducer";

export default combineReducers({
  configReducer,
  authReducer,
  managerReducer,
  employeeReducer,
});
