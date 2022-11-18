import {combineReducers} from 'redux';
import authReducer from './authReducer';
import managerReducer from './managerReducer';
import employeeReducer from './employeeReducer';

export default combineReducers({authReducer, managerReducer, employeeReducer});
