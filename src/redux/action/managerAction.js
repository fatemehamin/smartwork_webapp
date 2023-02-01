// import Snackbar from "react-native-snackbar";
import axiosAPI from "../../services/API/index";
import {
  ADD_EMPLOYEE,
  DELETE_EMPLOYEE,
  GET_EMPLOYEE,
  LOADED_MANAGER,
  LOADING_MANAGER,
  ERROR_MANAGER,
  ADD_PROJECT,
  GET_PROJECT,
  ADD_PROJECT_TO_EMPLOYEE,
  DELETE_PROJECT,
  DELETE_PROJECT_FROM_EMPLOYEE,
  EXPORT_EXCEL_REPORT,
  TOGGLE_EXCEL,
  ADD_LOCATION,
  DELETE_LOCATION,
  GET_LOCATION,
  GET_EMPLOYEE_LOCATION,
  ADD_LOCATION_TO_EMPLOYEE,
  DELETE_LOCATION_FROM_EMPLOYEE,
} from "./actionType";
import moment from "moment";
import jMoment from "moment-jalaali";

//-------------------------------------- get employee --------------------------------------//
export const getEmployee = () => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .get(`/employee_register/`, {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
      })
      .then((res) => {
        dispatch({ type: GET_EMPLOYEE, payload: res.data.detail });
      })
      .catch((err) => {
        console.log("getEmployee error", err);
        dispatch({
          type: ERROR_MANAGER,
          payload: { netError: "Error connecting to the system" },
        });
      });
  };
};
//-------------------------------------- add employee --------------------------------------//
export const addEmployee = (
  firstName,
  lastName,
  email,
  password,
  phoneNumber,
  setModalVisibleEmployee,
  setIsPress,
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setRePassword,
  setPhoneNumber
) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .post(
        "/employee_register/",
        {
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          phone_number: phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        dispatch({
          type: ADD_EMPLOYEE,
          payload: {
            first_name: firstName,
            last_name: lastName,
            email,
            password,
            phone_number: phoneNumber,
          },
        });
        setIsPress(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setRePassword("");
        setPhoneNumber("");
        setModalVisibleEmployee(false);
      })
      .catch((err) => {
        console.log("error add employee", err);
        dispatch({
          type: ERROR_MANAGER,
          payload: {
            duplicateEmployeeError:
              "This phone number is already in the system.",
          },
        });
      });
  };
};
//------------------------------------- delete employee -------------------------------------//
export const deleteEmployee = (phoneNumber) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    getState().authReducer.user.phoneNumber == phoneNumber
      ? dispatch({ type: LOADED_MANAGER })
      : // Snackbar.show({
        //   text: "This employee is the manager and it is not possible to remove it.",
        // })
        axiosAPI
          .delete(`/employee_register/${phoneNumber}/`, {
            headers: {
              Authorization: `Bearer ${getState().authReducer.accessToken}`,
            },
          })
          .then((res) =>
            dispatch({ type: DELETE_EMPLOYEE, payload: phoneNumber })
          )
          .catch((err) => {
            dispatch({ type: LOADED_MANAGER });
            // Snackbar.show({ text: "Employee not deleted Please try again." });
          });
  };
};
//--------------------------------------- get project ---------------------------------------//
export const getProject = () => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .get("/project_register/", {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
      })
      .then((res) => dispatch({ type: GET_PROJECT, payload: res.data.detail }))
      .catch((err) => {
        dispatch({
          type: ERROR_MANAGER,
          payload: { netError: "Error connecting to the system" },
        });
        console.log("get project list Error", err);
      });
  };
};
//--------------------------------------- add project ---------------------------------------//
export const addProject = (project_name, setProjectName) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .put(
        `/project_register/`,
        { project_name },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        // Snackbar.show({ text: "Add project successfully" });
        dispatch({
          type: ADD_PROJECT,
          payload: { project_name, sum_duration: 0 },
        });
        setProjectName("");
      })
      .catch((err) => {
        dispatch({
          type: ERROR_MANAGER,
          payload: { addProject: "Project not added, please try again." },
        });
        // Snackbar.show({ text: "Project not added, please try again." });
      });
  };
};
//-------------------------------------- delete project -------------------------------------//
export const deleteProject = (project_name) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .delete("/project_register/", {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
        data: { project_name },
      })
      .then((res) => dispatch({ type: DELETE_PROJECT, payload: project_name }))
      .catch((err) => {
        console.log("delete error", err);
        // Snackbar.show({ text: "Project not deleted, please try again." });
      });
  };
};
//--------------------------------- add project to employee ---------------------------------//
export const addProjectToEmployee = (phone_number, project_name) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .post(
        "/project_register/",
        { phone_number, project_name },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: ADD_PROJECT_TO_EMPLOYEE,
          payload: { phone_number, project_name },
        });
      })
      .catch((err) => {
        console.log("error add project to employee", err);
        dispatch({
          type: ERROR_MANAGER,
          payload: "Project not added to employee, please try again.",
        });
        // Snackbar.show({
        //   text: "Project not added to employee, please try again.",
        // });
      });
  };
};
//------------------------------- delete project from employee -------------------------------//
export const deleteProjectFromEmployee = (phone_number, project_name) => {
  return (dispatch, getState) => {
    axiosAPI
      .delete(`/project_state/`, {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
        data: { employee_username: phone_number, project_name },
      })
      .then((res) => {
        console.log(res.status);
        dispatch({
          type: DELETE_PROJECT_FROM_EMPLOYEE,
          payload: { phone_number, project_name },
        });
      })
      .catch((err) => console.log("delete project from employee", err));
  };
};
// --------------------------------------- access excel -------------------------------------//
export const accessExcel = (phoneNumber, toggleExcel, setToggleExcel) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER, payload: { typeError: "AccessExcel" } });
    axiosAPI
      .put(
        `/employee_register/${phoneNumber}/${toggleExcel}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        dispatch({
          type: TOGGLE_EXCEL,
          payload: { phoneNumber, toggleExcel, typeError: "AccessExcel" },
        });
        setToggleExcel(toggleExcel);
      })
      .catch((err) => {
        dispatch({
          type: ERROR_MANAGER,
          payload: { typeError: "AccessExcel" },
        });
        console.log("access error:", err);
      });
  };
};
//---------------------------------- export Excel Report ------------------------------------//
export const exportExcelReport = (
  year,
  month,
  daysInMonth,
  employeeNumber,
  employeeName,
  setModalVisible
) => {
  const startDate = jMoment(`${year}/${month}/1`, "jYYYY/jM/jD");
  const endDate = jMoment(`${year}/${month}/${daysInMonth}`, "jYYYY/jM/jD");
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .post(
        `/export_report/${year}/${month}/`,
        { employee_username: employeeNumber },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        if (res.data.report.length > 0) {
          axiosAPI
            .get(
              `/daily_report/${employeeNumber}/${startDate.year()}/${
                startDate.month() + 1
              }/${startDate.date()}/${endDate.year()}/${
                endDate.month() + 1
              }/${endDate.date()}/`,
              {
                headers: {
                  Authorization: `Bearer ${getState().authReducer.accessToken}`,
                },
              }
            )
            .then((resDailyReport) => {
              const pad = (n) => (n < 10 ? "0" + n : n);
              const time = (t) =>
                new Date(parseInt(t)).toTimeString().slice(0, 8);
              // find all projects name in a month + add entry & exit
              const AllProjects = [
                ...res.data.report
                  .map((report) => report.project_name)
                  .filter(
                    (PN, index, array) =>
                      array.indexOf(PN) == index && PN != "entry"
                  ),
                "entry", // move entry to last list
              ];
              // declare total list and fill with 0
              let total = [];
              AllProjects.forEach((element) => {
                total = [...total, 0];
              });
              // change date of report to jalaali
              const ReportOfJalaaliDate = res.data.report.map((report) => ({
                ...report,
                date: `${jMoment(report.date).jYear()}-${pad(
                  jMoment(report.date).jMonth() + 1
                )}-${pad(jMoment(report.date).jDate())}`,
              }));
              let reportDay = {};
              let merge = [];
              let pointerStart = { dateRow: 3, durationRow: 1, lastRow: 0 };
              let data = [];
              //data and config data
              for (let day = 1; day <= daysInMonth; day++) {
                let maxLength = 1;
                // generate date (date is jalaali)
                const date = `${year}-${pad(month)}-${pad(day)}`;
                // Separation by date
                let reportDayDetails = ReportOfJalaaliDate.filter(
                  (rep) => rep.date == date
                );
                // data
                if (reportDayDetails.length > 0) {
                  reportDay = {};
                  for (let index = 0; index < AllProjects.length; index++) {
                    let duration = 0;
                    let sameProject = reportDayDetails.filter(
                      (task) => AllProjects[index] == task.project_name
                    );
                    maxLength =
                      sameProject.length > maxLength
                        ? sameProject.length
                        : maxLength;
                    // total duration each project in a day
                    sameProject.forEach((element) => {
                      duration += element.duration
                        ? parseInt(element.duration)
                        : 0;
                    });
                    // total duration in month
                    total[index] = total[index] + duration;
                    duration = moment.duration(duration);
                    // sort in start time
                    sameProject > 0 && sameProject.sort((a, b) => a.start);
                    reportDay = {
                      ...reportDay,
                      [AllProjects[index]]:
                        sameProject.length > 0
                          ? sameProject.map((SP) => ({
                              start: time(SP.start),
                              end: time(SP.end),
                              duration: `${pad(duration.hours())}:${pad(
                                duration.minutes()
                              )}:${pad(duration.seconds())}`,
                            }))
                          : undefined,
                    };
                  }
                } else {
                  reportDay = {};
                }
                // format excel
                // merge date colum
                pointerStart.lastRow = pointerStart.lastRow + maxLength;
                merge = [
                  ...merge,
                  {
                    s: { r: pointerStart.dateRow, c: 0 },
                    e: { r: pointerStart.dateRow + maxLength - 1, c: 0 },
                  },
                  {
                    s: { r: pointerStart.dateRow, c: 1 },
                    e: { r: pointerStart.dateRow + maxLength - 1, c: 1 },
                  },
                ];
                pointerStart.dateRow = pointerStart.dateRow + maxLength;
                // ever date, all data row complete
                for (let row = 0; row < maxLength; row++) {
                  let dataOfRow = [];
                  pointerStart.durationRow = 4;
                  for (let colum = 0; colum < AllProjects.length; colum++) {
                    dataOfRow = [
                      ...dataOfRow,
                      ...(reportDay[AllProjects[colum]] !== undefined
                        ? reportDay[AllProjects[colum]][row] !== undefined
                          ? [
                              reportDay[AllProjects[colum]][row].start,
                              reportDay[AllProjects[colum]][row].end,
                              reportDay[AllProjects[colum]][0].duration,
                            ]
                          : ["", "", reportDay[AllProjects[colum]][0].duration]
                        : ["", "", ""]),
                    ];
                    // add last row for total time
                    if (row == maxLength - 1) {
                      merge = [
                        ...merge,
                        {
                          s: {
                            r: pointerStart.dateRow - maxLength,
                            c: pointerStart.durationRow,
                          },
                          e: {
                            r: pointerStart.dateRow - 1,
                            c: pointerStart.durationRow,
                          },
                        },
                      ];
                      pointerStart.durationRow = pointerStart.durationRow + 3;
                    }
                  }
                  //daily report
                  const fullDate = jMoment(
                    `${date.slice(0, 4)}/${date.slice(5, 7)}/${parseInt(
                      date.slice(8, 10)
                    )}`,
                    "jYYYY/jM/jD"
                  );
                  const dailyReport =
                    resDailyReport.data["report dictionary : "][
                      `${fullDate.year()}-${pad(fullDate.month() + 1)}-${pad(
                        fullDate.date()
                      )}`
                    ];
                  data = [...data, [date, dailyReport, ...dataOfRow]];
                }
              }
              // merge project name and total row
              for (
                let index = 2;
                index < (AllProjects.length - 1) * 3;
                index = index + 3
              ) {
                merge = [
                  ...merge,
                  {
                    // merge project name
                    s: { c: index, r: 1 },
                    e: { c: index + 2, r: 1 },
                  },
                  {
                    // merge total row
                    s: { c: index, r: pointerStart.lastRow + 3 },
                    e: { c: index + 2, r: pointerStart.lastRow + 3 },
                  },
                ];
              }
              merge = [
                ...merge,
                {
                  // merge total row last colum
                  s: {
                    c: AllProjects.length * 3 - 1,
                    r: pointerStart.lastRow + 3,
                  },
                  e: {
                    c: AllProjects.length * 3 + 1,
                    r: pointerStart.lastRow + 3,
                  },
                },
                {
                  // TOTAL Title
                  s: { c: 0, r: pointerStart.lastRow + 3 },
                  e: { c: 1, r: pointerStart.lastRow + 3 },
                },
                {
                  // merge employee name
                  s: { c: 0, r: 0 },
                  e: { c: AllProjects.length * 3 + 1, r: 0 },
                },
              ];
              let secondHeader = [];
              let newAllProject = [];
              let newTotalList = [];
              const date = (time) =>
                `${pad(parseInt(moment.duration(time).asHours()))}:${pad(
                  parseInt(moment.duration(time).minutes())
                )}:${pad(parseInt(moment.duration(time).seconds()))}`;
              for (let index = 0; index < AllProjects.length - 1; index++) {
                newTotalList = [
                  ...newTotalList,
                  date(total[index]),
                  date(total[index]),
                  date(total[index]),
                ];
                secondHeader = [
                  ...secondHeader,
                  "Start Time",
                  "End Time",
                  "Total Time",
                ];
                newAllProject = [
                  ...newAllProject,
                  AllProjects[index],
                  AllProjects[index],
                  AllProjects[index],
                ];
              }
              // total for entry
              newTotalList = [
                ...newTotalList,
                date(total[AllProjects.length - 1]),
                date(total[AllProjects.length - 1]),
                date(total[AllProjects.length - 1]),
              ];
              dispatch({
                type: EXPORT_EXCEL_REPORT,
                payload: {
                  data: [
                    [employeeName],
                    [
                      "Date",
                      "Daily Report",
                      ...newAllProject,
                      "ENTRY",
                      "EXIT",
                      "TOTAL",
                    ],
                    ["", "", ...secondHeader], //start & end
                    ...data,
                    ["TOTAL", "TOTAL", ...newTotalList],
                  ],
                  config: merge,
                },
              });
              setModalVisible(false);
            })
            .catch((err) => {
              dispatch({
                type: ERROR_MANAGER,
                payload: "Report Error",
              });
              console.log("Report Error :", err);
              // Snackbar.show({
              //   text: "connection failed please try again.",
              // });
            });
        } else {
          // Snackbar.show({
          //   text: "Not exist report on this date for employee.",
          // });
          dispatch({
            type: ERROR_MANAGER,
            payload: "Not exist report on this date.",
          });
        }
      })
      .catch((err) => {
        dispatch({
          type: ERROR_MANAGER,
          payload: "Report Error",
        });
        console.log("Report Error :", err);
        // Snackbar.show({
        //   text: "connection failed please try again.",
        // });
      });
  };
};
//-------------------------------------- get location ---------------------------------------//
export const getLocation = () => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .get("/location/", {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
      })
      .then((res) => {
        const locations = res.data.detail.map((location) => ({
          ...location,
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          radius: location.radius,
        }));
        dispatch({ type: GET_LOCATION, payload: locations });
      })
      .catch((err) => {
        console.log("error get location:", err);
        dispatch({ type: ERROR_MANAGER });
      });
  };
};
//-------------------------------------- add location --------------------------------------//
export const addLocation = (
  latitude,
  longitude,
  location_name,
  radius,
  setModalVisible,
  setIsPress
) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .post(
        "/location/",
        {
          x: latitude,
          y: longitude,
          location_name,
          radios: radius,
          company_boss: getState().authReducer.user.phoneNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        dispatch({
          type: ADD_LOCATION,
          payload: { latitude, longitude, location_name, radius },
        });
        setModalVisible(false);
        setIsPress(false);
      })
      .catch((err) => {
        dispatch({
          type: ERROR_MANAGER,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : err.response.data.detail,
        });
        setIsPress(false);
      });
  };
};
//------------------------------------ delete location -------------------------------------//
export const DeleteLocation = (location_name, setIsPress) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .delete("/location/", {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
        data: { location_name },
      })
      .then((res) => {
        dispatch({
          type: DELETE_LOCATION,
          payload: location_name,
        });
        setIsPress(false);
      })
      .catch((err) => {
        dispatch({
          type: ERROR_MANAGER,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : err.response.data.detail,
        });
        setIsPress(false);
      });
  };
};
//--------------------------------- get employee location ----------------------------------//
export const getEmployeeLocation = (phone_number) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .get(`/location_user/${phone_number}`, {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
      })
      .then((res) => {
        const locations = res.data.detail.map((location) => ({
          ...location,
          latitude: parseFloat(location.latitude),
          longitude: parseFloat(location.longitude),
          radius: location.radius,
        }));
        dispatch({
          type: GET_EMPLOYEE_LOCATION,
          payload: { phone_number, locations },
        });
      })
      .catch((err) => {
        console.log("error get employee location:", err);
        dispatch({ type: ERROR_MANAGER });
      });
  };
};
//-------------------------------- add location to employee --------------------------------//
export const addLocationToEmployee = (
  phone_number,
  location_name,
  setToggleCheckBox
) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .post(
        "/location_user/",
        {
          employee_user: phone_number,
          location_name,
        },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        console.log(res.status);
        dispatch({
          type: ADD_LOCATION_TO_EMPLOYEE,
          payload: { location_name, phone_number },
        });
        setToggleCheckBox(true);
      })
      .catch((err) => {
        console.log("error Add location to employee:", err);
        dispatch({ type: ERROR_MANAGER });
        // Snackbar.show({
        //   text: "Location not added to employee, please try again.",
        // });
      });
  };
};
//------------------------------ delete location from employee -----------------------------//
export const DeleteLocationFromEmployee = (
  phone_number,
  location_name,
  setToggleCheckBox
) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_MANAGER });
    axiosAPI
      .delete(`/location_user/`, {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
        data: {
          employee_user: phone_number,
          location_name,
        },
      })
      .then((res) => {
        console.log(res.status);
        dispatch({
          type: DELETE_LOCATION_FROM_EMPLOYEE,
          payload: { location_name, phone_number },
        });
        setToggleCheckBox(false);
      })
      .catch((err) => {
        console.log("error delete location:", err);
        dispatch({ type: ERROR_MANAGER });
      });
  };
};