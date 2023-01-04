import axiosAPI from "../../services/API/index";
import {
  LOADING_EMPLOYEE,
  ERROR_EMPLOYEE,
  GET_TASKS_EMPLOYEE,
  START_TIME,
  END_TIME,
  REPORT,
  DAILY_REPORT,
  ENTRY,
  EXIT,
  LOCATION,
} from "./actionType";
// import Snackbar from "react-native-snackbar";
import jMoment from "moment-jalaali";

//------------------------------------ get task project -----------------------------------//
export const getProject = () => {
  return async (dispatch, getState) => {
    const res = await axiosAPI.get("/project_state/", {
      headers: {
        Authorization: `Bearer ${getState().authReducer.accessToken}`,
      },
    });
    if (res.status) {
      const startTime = localStorage.getItem("startTime");
      const dailyReport = JSON.parse(localStorage.getItem("dailyReport"));
      dispatch({
        type: GET_TASKS_EMPLOYEE,
        payload: {
          data: res.data["active projects"],
          dailyReport,
          startTime,
        },
      });
    }
  };
};
//------------------------------------ start time ------------------------------------//
export const startTime = (project_name, time) => {
  return async (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    try {
      const res = await axiosAPI.put(
        "/project_state/",
        { project_name },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      );
      // res.status &&
      //   (localStorage.setItem("startTime", time.toString()),
      //   dispatch({
      //     type: START_TIME,
      //     payload: { project_name, startTime: time },
      //   }));
    } catch (err) {
      dispatch({
        type: ERROR_EMPLOYEE,
        payload: "Error connecting to the system",
      });
      console.log("err start time", err);
    }
  };
};
//------------------------------------- end time -------------------------------------//
export const endTime = (project_name, time, start_Project_name) => {
  return async (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    try {
      const res = await axiosAPI.patch(
        "/project_state/",
        { project_name },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      );
      // res.status &&
      //   (localStorage.removeItem("startTime"),
      //   dispatch({
      //     type: END_TIME,
      //     payload: { project_name, last_duration: res.data.last_duration },
      //   }));
      // when switch task (first end task then start another task)
      if (start_Project_name !== undefined) {
        const resStart = await axiosAPI.put(
          "/project_state/",
          { project_name: start_Project_name },
          {
            headers: {
              Authorization: `Bearer ${getState().authReducer.accessToken}`,
            },
          }
        );
        // resStart.status &&
        //   (localStorage.setItem("startTime", time.toString()),
        //   dispatch({
        //     type: START_TIME,
        //     payload: { project_name: start_Project_name, startTime: time },
        //   }));
      }
    } catch (err) {
      dispatch({
        type: ERROR_EMPLOYEE,
        payload: "Error connecting to the system",
      });
      console.log("error end time", err);
    }
  };
};
//------------------------------------- report ---------------------------------------//
export const report = (year, month, daysInMonth) => {
  const startDate = jMoment(`${year}/${month}/1`, "jYYYY/jM/jD");
  const endDate = jMoment(`${year}/${month}/${daysInMonth}`, "jYYYY/jM/jD");
  return (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    axiosAPI
      .get(`/export_report/${year}/${month}/`, {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
      })
      .then((res) => {
        if (res.data.report.length > 0) {
          axiosAPI
            .get(
              `/daily_report/${
                getState().authReducer.user.phoneNumber
              }/${startDate.year()}/${
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
              // find all projects in a month
              const AllProjects = res.data.report
                .map((report) => report.project_name)
                .filter((PN, index, array) => array.indexOf(PN) === index);
              // declare report in month and initial value
              let reportInMonth = [];
              AllProjects.forEach(
                (project) =>
                  (reportInMonth = {
                    ...reportInMonth,
                    [project]: 0,
                  })
              );
              // change date of report to jalaali
              const ReportOfJalaaliDate = res.data.report.map((report) => ({
                ...report,
                date: `${jMoment(report.date).jYear()}-${pad(
                  jMoment(report.date).jMonth() + 1
                )}-${pad(jMoment(report.date).jDate())}`,
              }));
              let reportDay = [];
              let reports = [];
              for (let day = 1; day <= daysInMonth; day++) {
                // generate date
                const date = `${year}-${pad(month)}-${pad(day)}`;
                // Separation by date
                let reportDayDetails = ReportOfJalaaliDate.filter(
                  (rep) => rep.date === date
                );
                if (reportDayDetails.length > 0) {
                  reportDay = [];
                  for (let index = 0; index < AllProjects.length; index++) {
                    let duration = 0;
                    const sameProject = reportDayDetails.filter(
                      (task) => AllProjects[index] === task.project_name
                    );
                    sameProject.forEach((element) => {
                      duration += element.duration
                        ? parseInt(element.duration)
                        : 0;
                    });
                    reportInMonth[AllProjects[index]] =
                      reportInMonth[AllProjects[index]] + duration;
                    reportDay = [
                      ...reportDay,
                      {
                        date: date,
                        duration,
                        project_name:
                          AllProjects[index] === "entry"
                            ? "Total Work Time"
                            : AllProjects[index],
                      },
                    ];
                  }
                } else {
                  reportDay = [];
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
                reports = [...reports, { [date]: { reportDay, dailyReport } }];
              }
              dispatch({ type: REPORT, payload: { reports, reportInMonth } });
            })
            .catch((err) => {
              // Snackbar.show({
              //   text: "connection failed please try again.",
              // });
              dispatch({
                type: ERROR_EMPLOYEE,
                payload: "Report Error",
              });
              console.log("Report Error :", err);
            });
        } else {
          // Snackbar.show({ text: "Not exist report on this date." });
          dispatch({
            type: ERROR_EMPLOYEE,
            payload: "Not exist report on this date.",
          });
        }
      })
      .catch((err) => {
        // Snackbar.show({
        //   text: "connection failed please try again.",
        // });
        dispatch({
          type: ERROR_EMPLOYEE,
          payload: "Report Error",
        });
        console.log("Report Error :", err);
      });
  };
};
//---------------------------------- daily report ------------------------------------//
export const dailyReport = (date, dailyReport, setToggle, isToggle, jDate) => {
  return async (dispatch, getState) => {
    console.log(getState().authReducer.accessToken);
    dispatch({ type: LOADING_EMPLOYEE });
    axiosAPI
      .post(
        `/daily_report/`,
        { date, report: dailyReport },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        setToggle(isToggle);
        if (new Date().toISOString().slice(0, 10) === date) {
          localStorage.setItem(
            "dailyReport",
            JSON.stringify({ dailyReport, date })
          );
          dispatch({
            type: DAILY_REPORT,
            payload: dailyReport,
          });
        } else {
          const newReport = getState().employeeReducer.report.map((rep) =>
            Object.keys(rep)[0] === jDate
              ? { [jDate]: { ...rep[jDate], dailyReport } }
              : rep
          );
          dispatch({ type: REPORT, payload: { reports: newReport } });
        }
      })
      .catch((err) => {
        dispatch({
          type: ERROR_EMPLOYEE,
          payload: "Daily report not save please try again.",
        });
        console.log("dailyReport", err);
      });
  };
};
//-------------------------------------- entry ---------------------------------------//
export const entry = (time, setIsEntry, setIsLoading) => {
  return async (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    try {
      const res = await axiosAPI.put(
        `/entry_exit/2525/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      );
      // res.status &&
      //   (setIsEntry(true),
      //   dispatch({
      //     type: ENTRY,
      //     payload: time,
      //   }));
      setIsLoading(false);
    } catch (err) {
      // Snackbar.show({
      //   text: "connection failed please try again.",
      // });
      dispatch({
        type: ERROR_EMPLOYEE,
        payload: "exit entry Error",
      });
      console.log("exit entry Error :", err);
      setIsLoading(false);
    }
  };
};
//--------------------------------------- exit ---------------------------------------//
export const exit = (time, setIsEntry, end_Project_name, setIsLoading) => {
  return async (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    try {
      // if have enable task first all task disable
      if (end_Project_name !== undefined) {
        const resEnd = await axiosAPI.patch(
          "/project_state/",
          { project_name: end_Project_name },
          {
            headers: {
              Authorization: `Bearer ${getState().authReducer.accessToken}`,
            },
          }
        );
        // resEnd.status &&
        //   (localStorage.removeItem("startTime"),
        //   dispatch({
        //     type: END_TIME,
        //     payload: { project_name: end_Project_name, endTime: time },
        //   }));
      }
      // then exit
      const res = await axiosAPI.patch(
        `/entry_exit/2525/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      );
      // res.status && (setIsEntry(false), dispatch({ type: EXIT }));
      setIsLoading(false);
    } catch (err) {
      // Snackbar.show({
      //   text: "connection failed please try again.",
      // });
      dispatch({
        type: ERROR_EMPLOYEE,
        payload: "exit entry Error",
      });
      console.log("exit entry Error:", err);
      setIsLoading(false);
    }
  };
};
//------------------------------------ location -------------------------------------//
export const location = (phone_number) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
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
          type: LOCATION,
          payload: locations,
        });
      })
      .catch((err) => {
        console.log("error get employee location:", err);
        dispatch({ type: ERROR_EMPLOYEE });
      });
  };
};
