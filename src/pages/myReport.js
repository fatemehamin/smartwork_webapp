import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchReports } from "../features/reports/action";
import { emptyReport } from "../features/reports/reportsSlice";
import { setMyReportActiveTab } from "../features/config/configSlice";
import { Divider } from "@mui/material";
import moment from "moment";
import jMoment from "moment-jalaali";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import Button from "../components/button";
import Calendar from "../components/picker";
import TextEdit from "../components/textEdit";
import "./myReport.css";

const MyReport = () => {
  const [jYear, setJYear] = useState(jMoment(new Date()).jYear());
  const [jMonth, setJMonth] = useState(jMoment(new Date()).jMonth());

  const { language } = useSelector((state) => state.i18n);
  const { userInfo } = useSelector((state) => state.auth);
  const { myReportActiveTab } = useSelector((state) => state.config);
  const { detailedReport, summeryReport, isLoading } = useSelector(
    (state) => state.reports
  );

  const [openSnackbar] = useSnackbar();
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

  const ProjectWithTime = ({ projectName, time }) => (
    <div className="summery-report direction">
      <p className="MR_textReport  bold">{projectName}</p>
      <p className="MR_textReport  bold">:</p>
      <p className="MR_textReport">{time}</p>
    </div>
  );

  const getDetailsReport = () =>
    detailedReport.map((report, index) => {
      const date = Object.keys(report)[0];

      const reportDay = (r, i) => {
        const duration = moment.duration(r.duration);

        const projectName =
          r.project_name === "entry"
            ? Translate("totalWorkingTime", language)
            : r.project_name;

        const time = `${pad(duration.hours())}:${pad(duration.minutes())}:${pad(
          duration.seconds()
        )}`;

        return (
          r.duration !== 0 && (
            <ProjectWithTime key={i} projectName={projectName} time={time} />
          )
        );
      };

      return (
        <div key={index} className="MR_report">
          <p className="MR_title text-align">{date}</p>
          {report[date].reportDay.length > 0 &&
            report[date].reportDay.map(reportDay)}
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

  const getSummaryReport = () => (
    <>
      <p className="MR_title  text-center">
        {Translate("summaryOfTheMonthlyReport", language)}
      </p>
      {Object.keys(summeryReport).map((project, index) => {
        const duration = moment.duration(summeryReport[project]);

        const projectName =
          project === "entry"
            ? Translate("totalWorkingTime", language)
            : project;

        const time = `${pad(parseInt(duration.asHours()))}:${pad(
          duration.minutes()
        )}:${pad(duration.seconds())}`;

        return (
          <div key={index} style={{ margin: "10px 20px" }}>
            <ProjectWithTime projectName={projectName} time={time} />
            <Divider />
          </div>
        );
      })}
    </>
  );

  const onSwitchTab = (activeTab) => dispatch(setMyReportActiveTab(activeTab));

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
        {detailedReport.length > 0 && (
          <>
            <Tabs
              tabs={[{ title: "summaryStatus" }, { title: "moreDetails" }]}
              activeTab={myReportActiveTab}
              onSwitchTab={onSwitchTab}
            />
            {myReportActiveTab === "moreDetails"
              ? getDetailsReport()
              : getSummaryReport()}
          </>
        )}
      </div>
    </>
  );
};

export default MyReport;
