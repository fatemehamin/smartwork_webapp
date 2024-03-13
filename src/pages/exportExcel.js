import React, { useState, useEffect } from "react";
import AppBar from "../components/appBar";
import Calendar from "../components/picker";
import moment from "moment-jalaali";
import jMoment from "moment-jalaali";
import Modal from "../components/modal";
import Button from "../components/button";
import ExcelFile from "../components/excelFile";
import CheckBox from "../components/checkBox";
import { emptyReport } from "../features/reports/reportsSlice";
import { Checkbox, Collapse, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { exportExcel } from "../features/reports/action";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { fetchProject } from "../features/projects/action";
import { fetchUsers } from "../features/users/action";
import { ExpandLess, ExpandMore, ArrowBackIos } from "@mui/icons-material";
import "./exportExcel.css";

const ExportExcel = () => {
  const [jYear, setJYear] = useState(jMoment(new Date()).jYear());
  const [jMonth, setJMonth] = useState(jMoment(new Date()).jMonth());
  const [modalVisible, setModalVisible] = useState(false);
  const [indexUserCurrent, setIndexUserCurrent] = useState(0);
  const [isCollapse, setIsCollapse] = useState(false);
  const [filterProject, setFilterProject] = useState(["entry"]);

  const { users } = useSelector((state) => state.users);
  const { language } = useSelector((state) => state.i18n);
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { excelReport, isLoading: isLoadingRep } = useSelector(
    (state) => state.reports
  );

  const dispatch = useDispatch();
  const [openSnackbar] = useSnackbar();

  useEffect(() => {
    dispatch(emptyReport());
    dispatch(fetchUsers());
    dispatch(fetchProject());
  }, []);

  const closeModal = () => setModalVisible(false);
  const openModal = () => setModalVisible(true);

  const toggleCollapse = () => setIsCollapse(!isCollapse);

  const handelBackBtnModal = () => {
    closeModal();
    setIsCollapse(false);
  };

  const calculateExcel = () => {
    const {
      reports,
      projects,
      leaves,
      delays,
      overTimes,
      lowTimes,
      daysInMonth,
      dailyReports,
      jYear,
      jMonth,
    } = excelReport;

    const pad = (n) => (n < 10 ? "0" + n : n);

    const formatTimeExcel = (timestamp) => {
      const time = new Date(parseInt(timestamp)).toTimeString().slice(0, 8);
      return { t: "s", v: time, z: "hh:mm:ss" };
    };

    const formatDurationExcel = (timestamp, formula) => {
      const duration = moment.duration(timestamp);
      const time = `${pad(duration.hours())}:${pad(duration.minutes())}:${pad(
        duration.seconds()
      )}`;

      return {
        t: "s",
        v: time,
        w: time,
        z: "[hh]:mm:ss",
        f: formula ? formula : `=TIMEVALUE("${time}")`,
      };
    };

    const convertToDate = (jDate) => {
      const date = jMoment(jDate, "jYYYY-jM-jD");
      // تاریخ یک روز بعد
      const nextDay = date.add(1, "day");
      return nextDay.toISOString().slice(0, 10);
    };

    const convertToJDate = (timestamp) => {
      return `${jMoment(timestamp).jYear()}-${pad(
        jMoment(timestamp).jMonth() + 1
      )}-${pad(jMoment(timestamp).jDate())}`;
    };

    const findLargestArray = (obj) => {
      const largestArray = Object.values(obj).reduce(
        (maxArray, currentArray) =>
          currentArray !== undefined && currentArray.length > maxArray.length
            ? currentArray
            : maxArray,
        []
      );
      return largestArray;
    };

    const cellMerge = (startRow, startColumn, endRow, endColumn) => ({
      s: { c: startColumn, r: startRow },
      e: { c: endColumn, r: endRow },
    });

    const nameCellExcel = (indexColumn, indexRow) => {
      // this function support just until two letter
      let letter = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (indexColumn < letter.length) {
        return letter[indexColumn] + indexRow;
      } else {
        const firstLetter = parseInt(indexColumn / letter.length) - 1;
        const secondLetter = indexColumn % letter.length;
        return letter[firstLetter] + letter[secondLetter] + indexRow;
      }
    };

    const funTotalColum = (colum, lastRow) => {
      const start = nameCellExcel(colum, 3);
      const end = nameCellExcel(colum, lastRow);
      return `SUM(${start}:${end})`;
    };

    // change date of report to jalaali
    const ReportOfJDate = reports.map((report) => ({
      ...report,
      date: convertToJDate(report.date),
    }));

    const headerAndTotal = (data = []) =>
      projects.reduce(
        (pre, project, index) => {
          const columDuration = index * 4 + (index ? 9 : 5);

          const totals = formatDurationExcel(
            reports
              .filter((report) => report.project_name === project)
              .reduce((total, r) => total + parseInt(r.duration || 0), 0),
            funTotalColum(columDuration, data.length)
          );

          const leaveTotal = formatDurationExcel(
            leaves.reduce((total, l) => total + parseInt(l.time_leave || 0), 0),
            funTotalColum(7, data.length)
          );

          const delayTotal = formatDurationExcel(
            delays.reduce((total, d) => total + parseInt(d.delay || 0), 0),
            funTotalColum(8, data.length)
          );

          const deductionTotal = formatDurationExcel(
            lowTimes.reduce((total, l) => total + parseInt(l.lowtime || 0), 0),
            funTotalColum(10, data.length)
          );

          const overTimeTotal = formatDurationExcel(
            overTimes.reduce(
              (total, o) => total + parseInt(o.over_time || 0),
              0
            ),
            funTotalColum(9, data.length)
          );

          const start = 4 * index + 7;
          const end = start + 3;

          if (project === "entry") {
            const first = [
              ...pre.first,
              Translate("ENTRY", language),
              Translate("EXIT", language),
              Translate("DURATION", language),
              Translate("TOTAL", language),
              Translate("leave", language),
              Translate("delay", language),
              Translate("overTime", language),
              Translate("deduction", language),
            ];

            const second = [...pre.second, "", "", "", "", "", "", "", ""];

            const hiddenColumn = [
              ...pre.hiddenColumn,
              { width: 8 },
              { width: 8 },
              { hidden: true },
              { width: 8 },
              { width: 8 },
              { width: 8 },
              { width: 8 },
              { width: 8 },
            ];

            const total = [
              ...pre.total,
              totals,
              totals,
              totals,
              totals,
              leaveTotal,
              delayTotal,
              overTimeTotal,
              deductionTotal,
            ];

            return { ...pre, first, second, total, hiddenColumn };
          }

          const first = [...pre.first, project, project, project, project];

          const second = [
            ...pre.second,
            Translate("start", language),
            Translate("end", language),
            Translate("duration", language),
            Translate("total", language),
          ];

          const hiddenColumn = [
            ...pre.hiddenColumn,
            { width: 8 },
            { width: 8 },
            { hidden: true },
            { width: 8 },
          ];

          const total = [...pre.total, totals, totals, totals, totals];

          const mergeProName = [
            ...pre.mergeProName,
            cellMerge(0, start, 0, end),
          ];

          return { ...pre, first, second, total, mergeProName, hiddenColumn };
        },
        {
          first: [
            Translate("date", language),
            Translate("daysWeek", language),
            Translate("dailyReport", language),
          ],
          second: ["", "", ""],
          total: [
            Translate("TOTAL", language),
            Translate("TOTAL", language),
            Translate("TOTAL", language),
          ],
          mergeProName: [],
          hiddenColumn: [{ width: 10 }, { width: 16 }, { width: 11 }],
        }
      );

    let merge = [];
    let data = [headerAndTotal().first, headerAndTotal().second];

    Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const date = `${jYear}-${pad(jMonth)}-${pad(dayIndex + 1)}`;

      const dateObject = new Date(convertToDate(date));
      const dateFormatter = new Intl.DateTimeFormat(
        language === "EN" ? "en-US" : "fa-IR",
        { weekday: "long" }
      );
      const dayOfWeekName = dateFormatter.format(dateObject);

      const dailyReport = dailyReports[convertToDate(date)];

      const leave = leaves.filter((l) => l.date === convertToDate(date));
      const leaveRow = formatDurationExcel(
        leave.reduce((total, l) => total + (l ? l.time_leave : 0), 0)
      );

      const delay = delays.filter((d) => d.date === convertToDate(date));
      const DelayRow = formatDurationExcel(delay[0] ? delay[0].delay : 0);

      const overTime = overTimes.filter((o) => o.date === convertToDate(date));
      const overTimeRow = formatDurationExcel(
        overTime[0] ? overTime[0].over_time : 0
      );

      const lowTime = lowTimes.filter((l) => l.date === convertToDate(date));
      const lowTimeRow = formatDurationExcel(
        lowTime[0] ? lowTime[0].lowtime : 0
      );

      const reportsDay = ReportOfJDate.filter((rep) => rep.date === date);

      const newReportsDay = projects.reduce((acc, project) => {
        if (reportsDay.length > 0) {
          const sameProject = reportsDay.filter(
            (p) => project === p.project_name
          );

          const totalDurationDay = sameProject.reduce(
            (total, report) => total + parseInt(report.duration || 0),
            0
          );

          const newSameProject = sameProject
            .sort((a) => a.start) // sort in start time
            .map((sp) => ({
              start: formatTimeExcel(sp.start),
              end: formatTimeExcel(sp.end),
              duration: sp.duration,
              total: totalDurationDay,
            }));

          return {
            ...acc,
            [project]: sameProject.length > 0 ? newSameProject : undefined,
          };
        }
        return { ...acc, [project]: undefined };
      }, {});

      const maxLengthDayReport = findLargestArray(newReportsDay).length;
      const startRowNum = data.length;

      const endRowNum = maxLengthDayReport
        ? startRowNum + maxLengthDayReport - 1
        : startRowNum;

      let isOneFiscal = true;

      for (
        let index = 0;
        index < maxLengthDayReport || (!maxLengthDayReport && !index);
        index++
      ) {
        const rowArrayProjects = projects.reduce((pre, project, i) => {
          const report = newReportsDay[project]
            ? newReportsDay[project][index] || {}
            : {};

          const Column = i * 4 + (i ? 7 : 3);

          const startCellDuration = nameCellExcel(Column, data.length + 1);
          const endCellDuration = nameCellExcel(Column + 1, data.length + 1);
          const funDuration = endCellDuration + "-" + startCellDuration;
          const duration = formatDurationExcel(report.duration, funDuration);

          const startCellTotal = nameCellExcel(Column + 2, startRowNum + 1);
          const endCellTotal = nameCellExcel(Column + 2, endRowNum + 1);
          const funTotal = `SUM(${startCellTotal}:${endCellTotal})`;
          const total = formatDurationExcel(report.total, funTotal);

          const fiscal =
            project === "entry"
              ? isOneFiscal
                ? [leaveRow, DelayRow, overTimeRow, lowTimeRow]
                : [undefined, undefined, undefined, undefined]
              : [];

          isOneFiscal = false;

          return [...pre, report.start, report.end, duration, total, ...fiscal];
        }, []);

        data.push([date, dayOfWeekName, dailyReport, ...rowArrayProjects]);
      }

      if (maxLengthDayReport > 1) {
        //merge colum(0=date, 1=day of weekName, 2=daily report, 7=leave, 8=delay, 9=overtime, 10=lowTime)
        merge.push(
          ...[0, 1, 2, 7, 8, 9, 10].map((i) =>
            cellMerge(startRowNum, i, endRowNum, i)
          ),
          //merge colum total project
          ...projects.map((_, index) => {
            const colum = 4 * index + (index ? 10 : 6);
            return cellMerge(startRowNum, colum, endRowNum, colum);
          })
        );
      }

      return { date, dayOfWeekName, dailyReport, ...newReportsDay };
    });

    data.push(headerAndTotal(data).total);

    const lastRowNumber = data.length - 1;

    merge.push(
      cellMerge(lastRowNumber, 0, lastRowNumber, 2), // merge total Title
      ...headerAndTotal().mergeProName, // merge project name
      ...projects.reduce((pre, _, index) => {
        const start = 4 * index + (index ? 7 : 3);
        const end = start + 3;
        return [...pre, cellMerge(lastRowNumber, start, lastRowNumber, end)]; // merge total row
      }, [])
    );

    for (let i = 0; i < 11; i++) {
      merge.push(cellMerge(0, i, 1, i)); // merge first header row
    }

    return { data, config: merge, hiddenColumn: headerAndTotal().hiddenColumn };
  };

  const handelExport = () => {
    const changeToDate = (jYear, jMonth, day) => {
      const d = jMoment(`${jYear}/${jMonth + 1}/${day}`, "jYYYY/jM/jD");
      return `${d.year()}/${d.month() + 1}/${d.date()}`;
    };

    const daysInMonth = jMoment.jDaysInMonth(parseInt(jYear), jMonth);

    const args = {
      year: parseInt(jYear),
      month: jMonth + 1,
      daysInMonth,
      startDate: changeToDate(jYear, jMonth, 1),
      endDate: changeToDate(jYear, jMonth, daysInMonth),
      phoneNumber: users[indexUserCurrent].phone_number,
      filterProject,
    };

    const _then = (res) => {
      if (res.reports.length <= 0) {
        openSnackbar(Translate("notExistReport", language));
        dispatch(emptyReport());
      } else {
        handelBackBtnModal();
      }
    };

    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    };

    dispatch(exportExcel(args)).unwrap().then(_then).catch(_error);
  };

  const getListProject = projects.map((project, index) => {
    const { project_name } = project;

    const toggleProject = (e) => {
      setFilterProject(
        e.target.checked
          ? [...filterProject, project_name]
          : filterProject.filter((p) => p !== project_name)
      );
    };

    return (
      <CheckBox
        key={index}
        name={project_name}
        onChange={toggleProject}
        style={{ width: "100%" }}
        disabled={isLoading}
        toggle={filterProject.find((p) => p === project_name) !== undefined}
      />
    );
  });

  return (
    <>
      <AppBar label="exportExcel" />

      <div className="excel-container">
        <div className="excel-text direction">
          {Translate("selectDateUserProject", language)}
        </div>
        <Button
          onClick={openModal}
          label={Translate("exportExcel", language)}
        />
        {excelReport != null && (
          <ExcelFile
            dataExcel={calculateExcel()}
            fullName={users[indexUserCurrent].full_name}
            jMonth={jMonth + 1}
            jYear={jYear}
          />
        )}

        <Modal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          customStyle={styles.customStyleModal}
        >
          <div className="excel-header-modal">
            <span className="excel-back-icon" onClick={handelBackBtnModal}>
              <ArrowBackIos />
            </span>
            <div className="excel-header-modal-text">
              {Translate("export", language)}
            </div>
          </div>

          <div className="excel-modal-section direction excel-modal-section-date">
            <span className="excel-modal-text ">
              {Translate("date", language)} :
            </span>
            <Calendar
              month={jMonth}
              setMonth={setJMonth}
              year={jYear}
              setYear={setJYear}
              isCalendar
            />
          </div>

          <div className="excel-modal-section direction">
            <Calendar
              label={`${Translate("user", language)} : `}
              onePicker={{
                data: users.map((u) => u.full_name),
                init: indexUserCurrent,
                onSelect: (selectItem) => setIndexUserCurrent(selectItem),
              }}
            />
          </div>

          <div className="excel-modal-section direction">
            <div className="excel-modal-collapse" onClick={toggleCollapse}>
              <span className="excel-modal-text">
                {Translate("projects", language)}
              </span>
              {isCollapse ? <ExpandLess /> : <ExpandMore />}
            </div>

            <Collapse in={isCollapse} className="excel-modal-content-collapse">
              <FormGroup>
                <FormControlLabel
                  disabled
                  sx={{ m: 0 }}
                  control={<Checkbox checked={true} />}
                  label={Translate("entry&Exit", language)}
                />
                <FormControlLabel
                  disabled
                  sx={{ m: 0 }}
                  control={<Checkbox checked={true} />}
                  label={Translate("dailyReport", language)}
                />
                {getListProject}
              </FormGroup>
            </Collapse>
          </div>

          <Button
            label={Translate("export", language)}
            onClick={handelExport}
            isLoading={isLoadingRep}
          />
        </Modal>
      </div>
    </>
  );
};

const styles = {
  customStyleModal: {
    height: window.innerHeight,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: "#f2f2f2",
    padding: 0,
  },
};

export default ExportExcel;
