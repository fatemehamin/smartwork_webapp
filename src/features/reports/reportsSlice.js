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
        projects,
        daysInMonth,
        dailyReports,
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

      let listTotalMonth = new Array(projects.length).fill(0);
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
          for (let index = 0; index < projects.length; index++) {
            let duration = 0;
            let sameProject = reportADay.filter(
              (p) => projects[index] === p.project_name
            );

            maxLength =
              sameProject.length > maxLength ? sameProject.length : maxLength;

            sameProject.forEach((sp) => {
              duration += sp.duration ? parseInt(sp.duration) : 0;
            });

            listTotalMonth[index] = listTotalMonth[index] + duration;
            reportDay = {
              ...reportDay,
              [projects[index]]:
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
          for (let colum = 0; colum < projects.length; colum++) {
            dataOfRow = [
              ...dataOfRow,
              ...(reportDay[projects[colum]] !== undefined
                ? reportDay[projects[colum]][row] !== undefined
                  ? [
                      reportDay[projects[colum]][row].start,
                      reportDay[projects[colum]][row].end,
                      reportDay[projects[colum]][0].duration,
                    ]
                  : ["", "", reportDay[projects[colum]][0].duration]
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
      for (let index = 5; index < projects.length * 3; index = index + 3) {
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
          e: { c: projects.length * 3 + 1, r: 0 },
        },
      ];
      let secondHeader = ["", "", ""];
      let newAllProject = [];
      let newTotalList = [];
      const date = (time) =>
        `${pad(parseInt(moment.duration(time).asHours()))}:${pad(
          parseInt(moment.duration(time).minutes())
        )}:${pad(parseInt(moment.duration(time).seconds()))}`;
      for (let index = 1; index < projects.length; index++) {
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
          projects[index],
          projects[index],
          projects[index],
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
    // builder.addCase(exportExcel.fulfilled, (state, action) => {
    //   const {
    //     reports,
    //     projects,
    //     daysInMonth,
    //     dailyReports,
    //     userName,
    //     jYear,
    //     jMonth,
    //   } = action.payload;

    //   const pad = (n) => (n < 10 ? "0" + n : n);

    //   const formatTimeExcel = (timestamp) => {
    //     const time = new Date(parseInt(timestamp)).toTimeString().slice(0, 8);
    //     return { t: "s", v: time, z: "hh:mm:ss" };
    //   };

    //   const formatDurationExcel = (timestamp) => {
    //     const duration = moment.duration(timestamp);
    //     const time = `${pad(duration.hours())}:${pad(duration.minutes())}:${pad(
    //       duration.seconds()
    //     )}`;
    //     return { t: "s", v: time, z: "[h]:mm:ss" };
    //   };

    //   const convertToDate = (jDate) => {
    //     const date = jMoment(jDate, "jYYYY-jM-jD");
    //     return date.toISOString().slice(0, 10);
    //   };

    //   const convertToJDate = (timestamp) => {
    //     return `${jMoment(timestamp).jYear()}-${pad(
    //       jMoment(timestamp).jMonth() + 1
    //     )}-${pad(jMoment(timestamp).jDate())}`;
    //   };

    //   const findLargestArray = (obj) => {
    //     const largestArray = Object.values(obj).reduce(
    //       (maxArray, currentArray) =>
    //         currentArray !== undefined && currentArray.length > maxArray.length
    //           ? currentArray
    //           : maxArray,
    //       []
    //     );
    //     return largestArray;
    //   };

    //   const cellMerge = (startRow, startColumn, endRow, endColumn) => ({
    //     s: { c: startColumn, r: startRow },
    //     e: { c: endColumn, r: endRow },
    //   });

    //   const nameCellExcel = (indexColumn, indexRow) => {
    //     // this function support just until two letter
    //     let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //     if (indexColumn < letter.length) {
    //       return letter[indexColumn] + indexRow;
    //     } else {
    //       const firstLetter = parseInt(indexColumn / letter.length) - 1;
    //       const secondLetter = indexColumn % letter.length;
    //       return letter[firstLetter] + letter[secondLetter] + indexRow;
    //     }
    //   };

    //   // change date of report to jalaali
    //   const ReportOfJDate = reports.map((report) => ({
    //     ...report,
    //     date: convertToJDate(report.date),
    //   }));

    //   const headerAndTotal = projects.reduce(
    //     (pre, project, index) => {
    //       const total = formatDurationExcel(
    //         reports
    //           .filter((report) => report.project_name === project)
    //           .reduce(
    //             (total, report) => total + parseInt(report.duration || 0),
    //             0
    //           )
    //       );

    //       const start = 4 * index + 2;
    //       const end = start + 3;

    //       if (project === "entry") {
    //         return {
    //           ...pre,
    //           first: [...pre.first, "ENTRY", "EXIT", "DURATION", "TOTAL"],
    //           second: [...pre.second, "", "", "", ""],
    //           total: [...pre.total, total, total, total, total],
    //         };
    //       }
    //       return {
    //         ...pre,
    //         first: [...pre.first, project, project, project, project],
    //         second: [...pre.second, "Start", "End", "Duration", "Total"],
    //         total: [...pre.total, total, total, total, total],
    //         mergeProName: [...pre.mergeProName, cellMerge(1, start, 1, end)],
    //       };
    //     },
    //     {
    //       first: ["Date", "Daily Report"],
    //       second: ["", ""],
    //       total: ["TOTAL", "TOTAL"],
    //       mergeProName: [],
    //     }
    //   );

    //   let merge = [];
    //   let data = [[userName], headerAndTotal.first, headerAndTotal.second];

    //   Array.from({ length: daysInMonth }, (_, dayIndex) => {
    //     const date = `${jYear}-${pad(jMonth)}-${pad(dayIndex + 1)}`;

    //     const dailyReport = dailyReports[convertToDate(date)];

    //     const reportsDay = ReportOfJDate.filter((rep) => rep.date === date);

    //     const newReportsDay = projects.reduce((acc, project) => {
    //       if (reportsDay.length > 0) {
    //         const sameProject = reportsDay.filter(
    //           (p) => project === p.project_name
    //         );

    //         const totalDurationDay = sameProject.reduce(
    //           (total, report) => total + parseInt(report.duration || 0),
    //           0
    //         );

    //         const newSameProject = sameProject
    //           .sort((a) => a.start) // sort in start time
    //           .map((sp) => ({
    //             start: formatTimeExcel(sp.start),
    //             end: formatTimeExcel(sp.end),
    //             duration: formatDurationExcel(sp.duration),
    //             total: formatDurationExcel(totalDurationDay),
    //           }));

    //         return {
    //           ...acc,
    //           [project]: sameProject.length > 0 ? newSameProject : undefined,
    //         };
    //       }
    //       return { ...acc };
    //     }, {});

    //     const maxLengthDayReport = findLargestArray(newReportsDay).length;
    //     const startRowNum = data.length;
    //     const endRowNum = startRowNum + maxLengthDayReport - 1;

    //     for (let index = 0; index < maxLengthDayReport; index++) {
    //       const rowArrayProjects = projects.reduce((preRow, project, i) => {
    //         const report = newReportsDay[project]
    //           ? newReportsDay[project][index] || {}
    //           : {};

    //         const r = report.duration
    //           ? report.duration
    //           : { t: "s", v: "00:00:00", z: "[h]:mm:ss" };
    //         // console.log("hh", report.duration, {
    //         //   ...r,

    //         //   f:
    //         //     nameCellExcel(i * 4 + 3, data.length + 1) +
    //         //     "-" +
    //         //     nameCellExcel(i * 4 + 2, data.length + 1),
    //         // });
    //         const duration = {
    //           ...r,
    //           f:
    //             nameCellExcel(i * 4 + 3, data.length + 1) +
    //             "-" +
    //             nameCellExcel(i * 4 + 2, data.length + 1),
    //         };

    //         const calculateTotal = () => {
    //           let totalFunction = "";
    //           for (let j = startRowNum + 1; j <= endRowNum + 1; j++) {
    //             // console.log(index);
    //             totalFunction =
    //               totalFunction +
    //               (totalFunction
    //                 ? "+" + nameCellExcel(i * 4 + 4, j)
    //                 : nameCellExcel(i * 4 + 4, j));
    //           }
    //           return totalFunction;
    //         };

    //         const total = {
    //           ...report.total,
    //           f: calculateTotal(),
    //         };

    //         return [
    //           ...preRow,
    //           report.start || undefined,
    //           report.end || undefined,
    //           duration,
    //           report.total ? total : undefined,
    //         ];
    //       }, []);

    //       data.push([date, dailyReport, ...rowArrayProjects]);
    //     }

    //     if (maxLengthDayReport > 1) {
    //       merge.push(
    //         cellMerge(startRowNum, 0, endRowNum, 0), //merge date colum
    //         cellMerge(startRowNum, 1, endRowNum, 1), //merge daily report colum
    //         ...projects.map((_, index) => {
    //           const colum = 4 * index + 5;
    //           return cellMerge(startRowNum, colum, endRowNum, colum);
    //         })
    //       );
    //     }

    //     return { date, dailyReport, ...newReportsDay };
    //     // }

    //     // data.push([date, dailyReport]);
    //     // return { date, dailyReport };
    //   });

    //   data.push(headerAndTotal.total);
    //   const lastRowNumber = data.length - 1;

    //   merge.push(
    //     cellMerge(0, 0, 0, projects.length * 4 + 1), // merge member name
    //     cellMerge(lastRowNumber, 0, lastRowNumber, 1), // merge total Title
    //     ...headerAndTotal.mergeProName, // merge project name
    //     ...projects.reduce((pre, _, index) => {
    //       const start = 4 * index + 2;
    //       const end = start + 3;
    //       return [...pre, cellMerge(lastRowNumber, start, lastRowNumber, end)]; // merge total row
    //     }, [])
    //   );

    //   console.log(data);

    //   state.excelReport = { data, config: merge };
    //   state.isLoading = false;
    // });
    builder.addCase(exportExcel.rejected, (state) => {
      state.isLoading = false;
    });
  },
});
export const { emptyReport } = reportsSlice.actions;
export default reportsSlice.reducer;
