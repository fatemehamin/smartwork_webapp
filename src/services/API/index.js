import axios from "axios";
// import {store} from '../../redux/store/index';
// import {accessToken, logout} from '../../redux/action/authAction';
// import jwtDecode from 'jwt-decode';
// import {getProject} from '../../redux/action/employeeAction';
// import {getEmployee} from '../../redux/action/managerAction';

const baseURL = "https://smartbyhub.com/smart_time/api";
const axiosAPI = axios.create({ baseURL });

// axiosAPI.interceptors.response.use(
//   response => {
//     return response;
//   },
//   error => {
//     if (
//       // error.response.data.code === 'token_not_valid' &&
//       // error.response.status === 401
//       jwtDecode(store.getState().authReducer.refreshToken).exp * 1000 <=
//       new Date().getTime()
//     ) {
//       store.dispatch(logout());
//     } else if (
//       jwtDecode(store.getState().authReducer.accessToken).exp * 1000 <=
//       new Date().getTime()
//     ) {
//       const refreshToken = store.getState().authReducer.refreshToken;
//       if (refreshToken != null) {
//         axiosAPI
//           .post('/token/refresh/', {refresh: refreshToken})
//           .then(res =>
//             store.dispatch(
//               accessToken(res.data.access, () =>
//                 store.getState().authReducer.type == 'boss'
//                   ? store.getState().managerReducer.employees.length <= 0 &&
//                     store.dispatch(getEmployee())
//                   : store.getState().employeeReducer.projects.length <= 0 &&
//                     store.dispatch(getProject()),
//               ),
//             ),
//           )
//           .catch(err => console.log('refreshTokenError', err));
//       }
//     }
//   },
// );

export default axiosAPI;