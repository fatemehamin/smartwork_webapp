import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchReports } from "../features/reports/action";
import { emptyReport } from "../features/reports/reportsSlice";
import moment from "moment";
import jMoment from "moment-jalaali";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import Button from "../components/button";
import Calendar from "../components/picker";
import TextEdit from "../components/textEdit";
import "./myReport.css";

const MyReport = () => {
  const [activeFilter, setActiveFilter] = useState("summaryStatus");
  const [jYear, setJYear] = useState(jMoment(new Date()).jYear());
  const [jMonth, setJMonth] = useState(jMoment(new Date()).jMonth());
  const [openSnackbar] = useSnackbar();
  const { language } = useSelector((state) => state.i18n);
  const { userInfo } = useSelector((state) => state.auth);
  const { detailedReport, summeryReport, isLoading } = useSelector(
    (state) => state.reports
  );
  const dispatch = useDispatch();
  const pad = (n) => (n < 10 ? "0" + n : n);

  const handleResultReport = () => {
    const changeToDate = (jYear, jMonth, day) => {
      const d = jMoment(`${jYear}/${jMonth + 1}/${day}`, "jYYYY/jM/jD");
      return `${d.year()}/${d.month() + 1}/${d.date()}`;
    };
    const daysInMonth = jMoment.jDaysInMonth(parseInt(jYear), jMonth);

    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    };

    const _then = (res) => {
      if (res.reports.length <= 0) {
        openSnackbar(Translate("notExistReport", language));
        dispatch(emptyReport());
      }
    };

    const args = {
      jYear: parseInt(jYear),
      jMonth: jMonth + 1,
      daysInMonth,
      startDate: changeToDate(jYear, jMonth, 1),
      endDate: changeToDate(jYear, jMonth, daysInMonth),
      phoneNumber: userInfo.phoneNumber,
    };

    dispatch(fetchReports(args)).unwrap().then(_then).catch(_error);
  };
  // console.log("gg");

  const getDetailsReport = () =>
    detailedReport != null &&
    detailedReport
      // sort list in date
      // .sort(
      //   (a, b) =>
      //     parseInt(Object.keys(a)[0].slice(8, 10)) -
      //     parseInt(Object.keys(b)[0].slice(8, 10))
      // )
      .map((report, index) => {
        const date = Object.keys(report)[0];
        return (
          <div key={index} className="MR_report">
            <p className="MR_date text-align">{date}</p>
            {report[date].reportDay.length > 0 &&
              report[date].reportDay.map((r, i) => {
                const duration = moment.duration(r.duration);
                return (
                  r.duration !== 0 && (
                    <p
                      key={i}
                      className="MR_textReport text-align direction"
                    >{`${
                      r.project_name === "entry"
                        ? Translate("totalWorkingTime", language)
                        : r.project_name
                    } : ${pad(duration.hours())}:${pad(
                      duration.minutes()
                    )}:${pad(duration.seconds())}`}</p>
                  )
                );
              })}
            <TextEdit
              jDate={date}
              report={
                report[date].dailyReport !== undefined
                  ? report[date].dailyReport
                  : ""
              }
            />
          </div>
        );
      });

  const getSummaryReport = () =>
    summeryReport != null && (
      <div>
        <p className="MR_date MR_textReport text-align">
          {Translate("summaryOfTheMonthlyReport", language)}
        </p>
        {Object.keys(summeryReport).map((project, index) => {
          const duration = moment.duration(summeryReport[project]);
          return (
            <p key={index} className="MR_textReport text-align direction">
              {project === "entry"
                ? Translate("totalWorkingTime", language)
                : project}{" "}
              : {pad(parseInt(duration.asHours()))}:{pad(duration.minutes())}:
              {pad(duration.seconds())}
            </p>
          );
        })}
      </div>
    );

  return (
    <>
      <AppBar label="myReport" />
      <div className="MR_container">
        <Calendar
          year={jYear}
          setYear={setJYear}
          setMonth={setJMonth}
          month={jMonth}
          isCalendar
        />
        <Button
          label={Translate("showResult", language)}
          isLoading={isLoading}
          onClick={handleResultReport}
        />
        <Tabs
          tabs={[{ title: "summaryStatus" }, { title: "moreDetails" }]}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
        {activeFilter === "moreDetails"
          ? getDetailsReport()
          : getSummaryReport()}
      </div>
    </>
  );
};

export default MyReport;
