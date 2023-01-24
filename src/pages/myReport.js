import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { report } from "../redux/action/employeeAction";
import moment from "moment";
import jMoment from "moment-jalaali";
import Button from "../components/Button";
import Calendar from "../components/picker";
import TextEdit from "../components/textEdit";
import { useSnackbar } from "react-simple-snackbar";
import "./myReport.css";

export default () => {
  const employeeState = useSelector((state) => state.employeeReducer);
  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState("Summary");
  const [year, setYear] = useState(jMoment(new Date()).jYear());
  const [month, setMonth] = useState(jMoment(new Date()).jMonth());
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [isPress, setIsPress] = useState(false);
  const pad = (n) => (n < 10 ? "0" + n : n);
  useEffect(() => {
    isPress && employeeState.isError && openSnackbar(employeeState.error);
  }, [employeeState.isError]);
  //--------------------------------------- Details Report ---------------------------------------//
  const getDetailsReport = () =>
    employeeState.report != null &&
    employeeState.report
      // sort list in date
      // .sort(
      //   (a, b) =>
      //     parseInt(Object.keys(a)[0].slice(8, 10)) -
      //     parseInt(Object.keys(b)[0].slice(8, 10)),
      // )
      .map((value, index) => {
        const date = Object.keys(value)[0];
        return (
          <div key={index} className="MR_report">
            <p className="MR_date">{date}</p>
            {value[date].reportDay.length > 0 &&
              value[date].reportDay.map((v, i) => {
                const duration = moment.duration(v.duration);
                return (
                  duration != 0 && (
                    <p key={i} className="MR_textReport">{`${
                      v.project_name
                    } : ${pad(duration.hours())}:${pad(
                      duration.minutes()
                    )}:${pad(duration.seconds())}`}</p>
                  )
                );
              })}
            <TextEdit
              report={
                value[date].dailyReport != undefined
                  ? value[date].dailyReport
                  : ""
              }
              date={date}
              jDate={date}
            />
          </div>
        );
      });
  //--------------------------------------- Summary Report ---------------------------------------//
  const getSummaryReport = () =>
    employeeState.reportInMonth != null && (
      <div>
        <p className="MR_date MR_textReport">Summary of the monthly report:</p>
        {Object.keys(employeeState.reportInMonth)
          .sort()
          .map((project, index) => {
            const duration = moment.duration(
              employeeState.reportInMonth[project]
            );
            return (
              <p key={index} className="MR_textReport">
                {project == "entry" ? "Total Work Time" : project} :{" "}
                {pad(parseInt(duration.asHours()))}:{pad(duration.minutes())}:
                {pad(duration.seconds())}
              </p>
            );
          })}
      </div>
    );
  //----------------------------------------- Filter View ----------------------------------------//
  const FilterView = () =>
    employeeState.report != null && (
      <div className="MR_filterContainer">
        <div
          key="Summery"
          className={`MR_filter ${
            activeFilter == "Summary" && "MR_activeFilter"
          }`}
          onClick={() => setActiveFilter("Summary")}
        >
          <span className="MR_filterText">Summary</span>
        </div>
        <div
          key="Details"
          className={`MR_filter ${
            activeFilter == "Details" && "MR_activeFilter"
          }`}
          onClick={() => setActiveFilter("Details")}
        >
          <span className="MR_filterText">Details</span>
        </div>
      </div>
    );
  return (
    <>
      <AppBar label="My Report" />
      <div className="MR_container">
        <Calendar
          year={year}
          setYear={setYear}
          setMonth={setMonth}
          month={month}
          // isCalendar
        />
        <Button
          label="Show Result"
          isLoading={employeeState.isLoading}
          onClick={() => {
            setIsPress(true);
            dispatch(
              report(
                parseInt(year),
                month + 1,
                jMoment.jDaysInMonth(parseInt(year), month),
                setIsPress
              )
            );
          }}
        />
        <FilterView />
        {activeFilter == "Details" ? getDetailsReport() : getSummaryReport()}
      </div>
    </>
  );
};
