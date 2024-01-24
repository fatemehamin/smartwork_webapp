import { createSlice } from "@reduxjs/toolkit";
import jMoment from "moment-jalaali";
import {
  exportExcel,
  fetchDailyReport,
  fetchReports,
  setDailyReport,
} from "./action";

const initialState = {
  detailedReport: [],
  summeryReport: null,
  dailyReport: "",
  excelReport: null,
  isLoading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    emptyReport: (state) => {
      state.detailedReport = [];
      state.summeryReport = null;
      state.excelReport = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDailyReport.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchDailyReport.fulfilled, (state, action) => {
      state.dailyReport = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchDailyReport.rejected, (state, action) => {
      state.isLoading = false;
      state.dailyReport = "";
    });
    builder.addCase(setDailyReport.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(setDailyReport.fulfilled, (state, action) => {
      const { date, dailyReport, jDate } = action.payload;
      new Date().toISOString().slice(0, 10) === date
        ? (state.dailyReport = dailyReport)
        : (state.detailedReport = state.detailedReport.map((r) =>
            Object.keys(r)[0] === jDate
              ? { [jDate]: { ...r[jDate], dailyReport } }
              : r
          ));
      state.isLoading = false;
    });
    builder.addCase(setDailyReport.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchReports.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      const { reports, jYear, jMonth, daysInMonth, dailyReports } =
        action.payload;
      const pad = (n) => (n < 10 ? "0" + n : n);
      const changeToJDate = (d) =>
        `${jMoment(d).jYear()}-${pad(jMoment(d).jMonth() + 1)}-${pad(
          jMoment(d).jDate()
        )}`;
      const changeToDate = (d) =>
        `${d.year()}-${pad(d.month() + 1)}-${pad(d.date())}`;

      // find all projects in a month
      const allNameProjects = reports
        .map((report) => report.project_name)
        .filter((PN, index, array) => array.indexOf(PN) === index);

      let summeryReport = null;
      allNameProjects.forEach(
        (p) => (summeryReport = { ...summeryReport, [p]: 0 })
      );
      // change date of report to jalaali
      const ReportOfJDate = reports.map((r) => ({
        ...r,
        date: changeToJDate(r.date),
      }));
      let reportDay = [];
      let detailedReport = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const date = `${jYear}-${pad(jMonth)}-${pad(day)}`; // generate date
        let reportADay = ReportOfJDate.filter((rep) => rep.date === date); // Separation by date
        if (reportADay.length > 0) {
          reportDay = [];
          for (let index = 0; index < allNameProjects.length; index++) {
            let duration = 0;
            const sameProject = reportADay.filter(
              (p) => allNameProjects[index] === p.project_name
            );
            sameProject.forEach(
              (sp) => (duration += sp.duration ? parseInt(sp.duration) : 0)
            );
            summeryReport[allNameProjects[index]] =
              summeryReport[allNameProjects[index]] + duration;
            reportDay.push({
              date: date,
              duration,
              project_name: allNameProjects[index],
            });
          }
        } else {
          reportDay = [];
        }
        //daily report
        const dailyReport =
          dailyReports[changeToDate(jMoment(date, "jYYYY-jM-jD"))];
        detailedReport = [
          ...detailedReport,
          { [date]: { reportDay, dailyReport } },
        ];
      }
      state.isLoading = false;
      state.detailedReport = detailedReport;
      state.summeryReport = summeryReport;
    });
    builder.addCase(fetchReports.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(exportExcel.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(exportExcel.fulfilled, (state, action) => {
      state.excelReport = action.payload;
      state.isLoading = false;
    });
    builder.addCase(exportExcel.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const { emptyReport } = reportsSlice.actions;
export default reportsSlice.reducer;
