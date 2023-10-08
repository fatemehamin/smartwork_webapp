import { createSlice } from "@reduxjs/toolkit";
import moment from "moment-jalaali";
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
      const {
        reports,
        daysInMonth,
        dailyReports,
        FilterProject,
        userName,
        jYear,
        jMonth,
      } = action.payload;
      const pad = (n) => (n < 10 ? "0" + n : n);
      const time = (t) => new Date(parseInt(t)).toTimeString().slice(0, 8);
      const changeToJDate = (d) =>
        `${jMoment(d).jYear()}-${pad(jMoment(d).jMonth() + 1)}-${pad(
          jMoment(d).jDate()
        )}`;
      const changeToTime = (d) =>
        `${pad(d.hours())}:${pad(d.minutes())}:${pad(d.seconds())}`;

      // find all projects name in a month + add entry & exit
      const allNameProjects = [
        "entry", // move entry to first list
        ...reports
          .map((report) => report.project_name)
          .filter(
            (PN, index, array) => array.indexOf(PN) === index && PN !== "entry"
          ),
      ].filter((pro) => FilterProject.find((p) => p === pro) === pro);

      let listTotalMonth = new Array(allNameProjects.length).fill(0);
      // change date of report to jalaali
      const ReportOfJDate = reports.map((r) => ({
        ...r,
        date: changeToJDate(r.date),
      }));
      let reportDay = {};
      let merge = [];
      let pointerStart = { dateRow: 3, durationRow: 1, lastRow: 0 };
      let data = [];

      //data and config data
      for (let day = 1; day <= daysInMonth; day++) {
        let maxLength = 1;
        const date = `${jYear}-${pad(jMonth)}-${pad(day)}`; // generate date
        let reportADay = ReportOfJDate.filter((rep) => rep.date === date); // Separation by date
        // data
        if (reportADay.length > 0) {
          reportDay = {};
          for (let index = 0; index < allNameProjects.length; index++) {
            let duration = 0;
            let sameProject = reportADay.filter(
              (p) => allNameProjects[index] === p.project_name
            );

            maxLength =
              sameProject.length > maxLength ? sameProject.length : maxLength;

            sameProject.forEach((sp) => {
              duration += sp.duration ? parseInt(sp.duration) : 0;
            });

            listTotalMonth[index] = listTotalMonth[index] + duration;
            reportDay = {
              ...reportDay,
              [allNameProjects[index]]:
                sameProject.length > 0
                  ? sameProject
                      .sort((a) => a.start) // sort in start time
                      .map((sp) => ({
                        start: time(sp.start),
                        end: time(sp.end),
                        duration: changeToTime(moment.duration(duration)),
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
          for (let colum = 0; colum < allNameProjects.length; colum++) {
            dataOfRow = [
              ...dataOfRow,
              ...(reportDay[allNameProjects[colum]] !== undefined
                ? reportDay[allNameProjects[colum]][row] !== undefined
                  ? [
                      reportDay[allNameProjects[colum]][row].start,
                      reportDay[allNameProjects[colum]][row].end,
                      reportDay[allNameProjects[colum]][0].duration,
                    ]
                  : ["", "", reportDay[allNameProjects[colum]][0].duration]
                : ["", "", ""]),
            ];
            // add last row for total time
            if (row === maxLength - 1) {
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
            dailyReports[
              `${fullDate.year()}-${pad(fullDate.month() + 1)}-${pad(
                fullDate.date()
              )}`
            ];
          data = [...data, [date, dailyReport, ...dataOfRow]];
        }
      }
      // merge project name and total row
      for (
        let index = 5;
        index < allNameProjects.length * 3;
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
          // merge total row first colum
          s: { c: 2, r: pointerStart.lastRow + 3 },
          e: { c: 4, r: pointerStart.lastRow + 3 },
        },
        {
          // TOTAL Title
          s: { c: 0, r: pointerStart.lastRow + 3 },
          e: { c: 1, r: pointerStart.lastRow + 3 },
        },
        {
          // merge employee name
          s: { c: 0, r: 0 },
          e: { c: allNameProjects.length * 3 + 1, r: 0 },
        },
      ];
      let secondHeader = ["", "", ""];
      let newAllProject = [];
      let newTotalList = [];
      const date = (time) =>
        `${pad(parseInt(moment.duration(time).asHours()))}:${pad(
          parseInt(moment.duration(time).minutes())
        )}:${pad(parseInt(moment.duration(time).seconds()))}`;
      for (let index = 1; index < allNameProjects.length; index++) {
        newTotalList = [
          ...newTotalList,
          date(listTotalMonth[index]),
          date(listTotalMonth[index]),
          date(listTotalMonth[index]),
        ];
        secondHeader = [
          ...secondHeader,
          "Start Time",
          "End Time",
          "Total Time",
        ];
        newAllProject = [
          ...newAllProject,
          allNameProjects[index],
          allNameProjects[index],
          allNameProjects[index],
        ];
      }
      // total for entry
      newTotalList = [
        date(listTotalMonth[0]),
        date(listTotalMonth[0]),
        date(listTotalMonth[0]),
        ...newTotalList,
      ];

      state.excelReport = {
        data: [
          [userName],
          ["Date", "Daily Report", "ENTRY", "EXIT", "TOTAL", ...newAllProject],
          ["", "", ...secondHeader], //start & end
          ...data,
          ["TOTAL", "TOTAL", ...newTotalList],
        ],
        config: merge,
      };
      state.isLoading = false;
    });
    builder.addCase(exportExcel.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const { emptyReport } = reportsSlice.actions;
export default reportsSlice.reducer;
