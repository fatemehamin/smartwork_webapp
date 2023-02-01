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
import jMoment from "moment-jalaali";

//------------------------------------ get task project -----------------------------------//
export const getProject = () => {
  return (dispatch, getState) => {
    axiosAPI
      .get("/project_state/", {
        headers: {
          Authorization: `Bearer ${getState().authReducer.accessToken}`,
        },
      })
      .then((res) => {
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
      })
      .catch((err) => {
        dispatch({
          type: ERROR_EMPLOYEE,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : err.response.data.detail,
        });
      });
  };
};
//------------------------------------ start time ------------------------------------//
export const startTime = (project_name, time, setIsPress) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    axiosAPI
      .put(
        "/project_state/",
        { project_name },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        localStorage.setItem("startTime", time.toString());
        dispatch({
          type: START_TIME,
          payload: { project_name, startTime: time },
        });
        setIsPress(false);
      })
      .catch((err) => {
        dispatch({
          type: ERROR_EMPLOYEE,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : err.response.data.detail,
        });
        setIsPress(false);
      });
  };
};
//------------------------------------- end time -------------------------------------//
export const endTime = (project_name, time, start_Project_name, setIsPress) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    axiosAPI
      .patch(
        "/project_state/",
        { project_name },
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        localStorage.removeItem("startTime");
        dispatch({
          type: END_TIME,
          payload: { project_name, last_duration: res.data.last_duration },
        });
        // when switch task (first end task then start another task)
        if (start_Project_name !== undefined) {
          axiosAPI
            .put(
              "/project_state/",
              { project_name: start_Project_name },
              {
                headers: {
                  Authorization: `Bearer ${getState().authReducer.accessToken}`,
                },
              }
            )
            .then((resStart) => {
              localStorage.setItem("startTime", time.toString());
              dispatch({
                type: START_TIME,
                payload: { project_name: start_Project_name, startTime: time },
              });
            })
            .catch((err) => {
              dispatch({
                type: ERROR_EMPLOYEE,
                payload:
                  err.code == "ERR_NETWORK"
                    ? "connection failed please check your network."
                    : err.response.data.detail,
              });
            });
        }
        setIsPress(false);
      })
      .catch((err) => {
        dispatch({
          type: ERROR_EMPLOYEE,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : err.response.data.detail,
        });
        setIsPress(false);
      });
  };
};
//------------------------------------- report ---------------------------------------//
export const report = (year, month, daysInMonth, setIsPress) => {
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
              dispatch({
                type: ERROR_EMPLOYEE,
                payload:
                  err.code == "ERR_NETWORK"
                    ? "connection failed please check your network."
                    : err.response.data.detail,
              });
            });
        } else {
          dispatch({
            type: ERROR_EMPLOYEE,
            payload: "Not exist report on this date.",
          });
        }
        setIsPress(false);
      })
      .catch((err) => {
        dispatch({
          type: ERROR_EMPLOYEE,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : err.response.data.detail,
        });
        setIsPress(false);
      });
  };
};
//---------------------------------- daily report ------------------------------------//
export const dailyReport = (
  date,
  dailyReport,
  setToggle,
  isToggle,
  jDate,
  setIsPress
) => {
  return (dispatch, getState) => {
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
            payload: { dailyReport, date },
          });
          setIsPress(false);
        } else {
          const newReport = getState().employeeReducer.report.map((rep) =>
            Object.keys(rep)[0] === jDate
              ? { [jDate]: { ...rep[jDate], dailyReport } }
              : rep
          );
          dispatch({ type: REPORT, payload: { reports: newReport } });
        }
        setIsPress(false);
      })
      .catch((err) => {
        dispatch({
          type: ERROR_EMPLOYEE,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : "Daily report not save please try again.",
        });
        setIsPress(false);
      });
  };
};
//-------------------------------------- entry ---------------------------------------//
export const entry = (time, setIsEntry, setIsPress) => {
  return (dispatch, getState) => {
    dispatch({ type: LOADING_EMPLOYEE });
    axiosAPI
      .put(
        `/entry_exit/2525/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getState().authReducer.accessToken}`,
          },
        }
      )
      .then((res) => {
        setIsEntry(true);
        setIsPress(false);
        dispatch({
          type: ENTRY,
          payload: time,
        });
      })
      .catch((err) => {
        dispatch({
          type: ERROR_EMPLOYEE,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : err.response.data.detail,
        });
        setIsPress(false);
      });
  };
};
//--------------------------------------- exit ---------------------------------------//
export const exit = (time, setIsEntry, end_Project_name, setIsPress) => {
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
        localStorage.removeItem("startTime");
        dispatch({
          type: END_TIME,
          payload: { project_name: end_Project_name, endTime: time },
        });
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
      setIsEntry(false);
      setIsPress(false);
      dispatch({ type: EXIT });
    } catch (err) {
      dispatch({
        type: ERROR_EMPLOYEE,
        payload:
          err.code == "ERR_NETWORK"
            ? "connection failed please check your network."
            : err.response.data.detail,
      });
      setIsPress(false);
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
        dispatch({
          type: ERROR_EMPLOYEE,
          payload:
            err.code == "ERR_NETWORK"
              ? "connection failed please check your network."
              : "",
        });
      });
  };
};
