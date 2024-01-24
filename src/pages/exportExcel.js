import React, { useState, useEffect } from "react";
import AppBar from "../components/appBar";
import Calendar from "../components/picker";
import * as XLSX from "xlsx";
import jMoment from "moment-jalaali";
import Modal from "../components/modal";
import Button from "../components/button";
import Excel from "../assets/icons/excel.svg";
import moment from "moment-jalaali";
import { emptyReport } from "../features/reports/reportsSlice";
import { Checkbox, Collapse, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { exportExcel } from "../features/reports/action";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { fetchProject } from "../features/projects/action";
import { fetchUsers } from "../features/users/action";
import {
  FileDownload,
  ExpandLess,
  ExpandMore,
  ArrowBackIos,
} from "@mui/icons-material";
import "./exportExcel.css";

const ExportExcel = () => {
  const [jYear, setJYear] = useState(jMoment(new Date()).jYear());
  const [jMonth, setJMonth] = useState(jMoment(new Date()).jMonth());
  const [modalVisible, setModalVisible] = useState(false);
  const [indexEmployeeCurrent, setIndexEmployeeCurrent] = useState(0);
  const [isCollapse, setIsCollapse] = useState(false);
  const [filterProject, setFilterProject] = useState(["entry"]);
  const [openSnackbar] = useSnackbar();
  const [employees, setEmployees] = useState({
    name: [""],
    number: [],
    data: [],
  });

  const { users } = useSelector((state) => state.users);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { excelReport, isLoading: isLoadingRep } = useSelector(
    (state) => state.reports
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(emptyReport());
    dispatch(fetchUsers());
    dispatch(fetchProject());
  }, []);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const nowTime = new Date().getTime();

  const filename = `${employees.name[indexEmployeeCurrent]}_${jYear}${pad(
    jMonth + 1
  )}_${nowTime}`;

  const getUsers = () => {
    let number = [];
    let name = [];
    let data = [];
    users.forEach((employee) => {
      number = [...number, employee.phone_number];
      name = [...name, `${employee.first_name} ${employee.last_name}`];
      data = [...data, ""];
    });
    setEmployees(() => ({ number, name, data }));
    setIndexEmployeeCurrent(indexEmployeeCurrent);
  };

  const calculateExcel = () => {
    const {
      reports,
      projects,
      daysInMonth,
      dailyReports,
      userName,
      jYear,
      jMonth,
    } = excelReport;

    const formatTimeExcel = (timestamp) => {
      const time = new Date(parseInt(timestamp)).toTimeString().slice(0, 8);
      return { t: "s", v: time, z: "hh:mm:ss" };
    };

    const formatDurationExcel = (timestamp) => {
      const duration = moment.duration(timestamp);
      const time = `${pad(duration.hours())}:${pad(duration.minutes())}:${pad(
        duration.seconds()
      )}`;
      return { t: "s", v: time, z: "[h]:mm:ss" };
    };

    const convertToDate = (jDate) => {
      const date = jMoment(jDate, "jYYYY-jM-jD");
      return date.toISOString().slice(0, 10);
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

    // change date of report to jalaali
    const ReportOfJDate = reports.map((report) => ({
      ...report,
      date: convertToJDate(report.date),
    }));

    const headerAndTotal = (data = []) =>
      projects.reduce(
        (pre, project, index) => {
          const startCellTotal = nameCellExcel(index * 4 + 5, 4);
          const endCellTotal = nameCellExcel(index * 4 + 5, data.length);
          const funTotal = `SUM(${startCellTotal}:${endCellTotal})`;

          const total = {
            f: funTotal,
            ...formatDurationExcel(
              reports
                .filter((report) => report.project_name === project)
                .reduce(
                  (total, report) => total + parseInt(report.duration || 0),
                  0
                )
            ),
          };

          const start = 4 * index + 3;
          const end = start + 3;

          const hiddenColumn = [
            ...pre.hiddenColumn,
            { width: 8 },
            { width: 8 },
            { hidden: true },
            { width: 8 },
          ];

          if (project === "entry") {
            return {
              ...pre,
              first: [
                ...pre.first,
                Translate("ENTRY", language),
                Translate("EXIT", language),
                Translate("DURATION", language),
                Translate("TOTAL", language),
              ],
              second: [...pre.second, "", "", "", ""],
              total: [...pre.total, total, total, total, total],
              hiddenColumn,
            };
          }
          return {
            ...pre,
            first: [...pre.first, project, project, project, project],
            second: [
              ...pre.second,
              Translate("start", language),
              Translate("end", language),
              Translate("duration", language),
              Translate("total", language),
            ],
            total: [...pre.total, total, total, total, total],
            mergeProName: [...pre.mergeProName, cellMerge(1, start, 1, end)],
            hiddenColumn,
          };
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
    let data = [[userName], headerAndTotal().first, headerAndTotal().second];

    Array.from({ length: daysInMonth }, (_, dayIndex) => {
      const date = `${jYear}-${pad(jMonth)}-${pad(dayIndex + 1)}`;

      const dateObject = new Date(date);
      const dateFormatter = new Intl.DateTimeFormat(
        language === "EN" ? "en-US" : "fa-IR",
        { weekday: "long" }
      );
      const dayOfWeekName = dateFormatter.format(dateObject);

      const dailyReport = dailyReports[convertToDate(date)];

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

      for (
        let index = 0;
        index < maxLengthDayReport || (!maxLengthDayReport && !index);
        index++
      ) {
        const rowArrayProjects = projects.reduce((preRow, project, i) => {
          const report = newReportsDay[project]
            ? newReportsDay[project][index] || {}
            : {};

          const startCellDuration = nameCellExcel(i * 4 + 3, data.length + 1);
          const endCellDuration = nameCellExcel(i * 4 + 4, data.length + 1);
          const funDuration = endCellDuration + "-" + startCellDuration;

          const duration = {
            ...formatDurationExcel(report.duration),
            f: funDuration,
          };

          const startCellTotal = nameCellExcel(i * 4 + 5, startRowNum + 1);
          const endCellTotal = nameCellExcel(i * 4 + 5, endRowNum + 1);
          const funTotal = startCellTotal + ":" + endCellTotal;

          const total = { ...formatDurationExcel(report.total), f: funTotal };

          return [...preRow, report.start, report.end, duration, total];
        }, []);

        data.push([date, dayOfWeekName, dailyReport, ...rowArrayProjects]);
      }

      if (maxLengthDayReport > 1) {
        merge.push(
          cellMerge(startRowNum, 0, endRowNum, 0), //merge date colum
          cellMerge(startRowNum, 1, endRowNum, 1), //merge day of weekName colum
          cellMerge(startRowNum, 2, endRowNum, 2), //merge daily report colum
          ...projects.map((_, index) => {
            const colum = 4 * index + 6;
            return cellMerge(startRowNum, colum, endRowNum, colum);
          })
        );
      }

      return { date, dayOfWeekName, dailyReport, ...newReportsDay };
    });

    data.push(headerAndTotal(data).total);

    const lastRowNumber = data.length - 1;

    merge.push(
      cellMerge(0, 0, 0, projects.length * 4 + 2), // merge member name
      cellMerge(lastRowNumber, 0, lastRowNumber, 2), // merge total Title
      ...headerAndTotal().mergeProName, // merge project name
      ...projects.reduce((pre, _, index) => {
        const start = 4 * index + 3;
        const end = start + 3;
        return [...pre, cellMerge(lastRowNumber, start, lastRowNumber, end)]; // merge total row
      }, [])
    );

    return { data, config: merge, hiddenColumn: headerAndTotal().hiddenColumn };
  };

  const exportFile = (filename) => {
    const wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(calculateExcel().data);

    //Create workbook and set Views if workbook is not already defined
    if (!wb.Workbook) {
      wb.Workbook = {};
    }
    wb.Workbook.Views = [{ RTL: I18nManager.isRTL }];

    ws["!cols"] = calculateExcel().hiddenColumn;
    ws["!merges"] = calculateExcel().config;

    XLSX.utils.book_append_sheet(wb, ws, "ReportSheet");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const ExcelFileView = () =>
    excelReport != null && (
      <div className="excel-file">
        <img src={Excel} className="excel-icon" alt="excel" />
        <div className="excel-modal-text excel-one-line">{filename}.xlsx</div>
        <span
          onClick={() => exportFile(filename)}
          className="excel-icon-download"
        >
          <FileDownload />
        </span>
      </div>
    );

  const onExportFilterHandler = () => {
    const changeToDate = (jYear, jMonth, day) => {
      const d = jMoment(`${jYear}/${jMonth + 1}/${day}`, "jYYYY/jM/jD");
      return `${d.year()}/${d.month() + 1}/${d.date()}`;
    };

    const daysInMonth = jMoment.jDaysInMonth(parseInt(jYear), jMonth);

    dispatch(
      exportExcel({
        year: parseInt(jYear),
        month: jMonth + 1,
        daysInMonth,
        startDate: changeToDate(jYear, jMonth, 1),
        endDate: changeToDate(jYear, jMonth, daysInMonth),
        phoneNumber: employees.number[indexEmployeeCurrent],
        userName: employees.name[indexEmployeeCurrent],
        filterProject,
      })
    )
      .unwrap()
      .then((res) => {
        if (res.reports.length <= 0) {
          openSnackbar(Translate("notExistReport", language));
          dispatch(emptyReport());
        } else {
          backModal();
        }
      })
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  };

  const closeModal = () => setModalVisible(false);
  const openModal = () => {
    setModalVisible(true);
    getUsers();
  };

  const toggleCollapse = () => setIsCollapse(!isCollapse);
  const closeCollapse = () => setIsCollapse(false);

  const backModal = () => {
    closeModal();
    closeCollapse();
  };

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
        <ExcelFileView />
        <Modal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          customStyle={styles.customStyleModal}
        >
          <div className="excel-header-modal">
            <span className="excel-back-icon" onClick={backModal}>
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
                data: employees.name,
                init: indexEmployeeCurrent,
                onSelect: (selectItem) => setIndexEmployeeCurrent(selectItem),
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
                  control={<Checkbox checked={true} />}
                  label={Translate("entry&Exit", language)}
                />
                <FormControlLabel
                  disabled
                  control={<Checkbox checked={true} />}
                  label={Translate("dailyReport", language)}
                />
                {projects.map((project, index) => (
                  <CheckBoxProject
                    key={index}
                    filterProject={filterProject}
                    setFilterProject={setFilterProject}
                    projectName={project.project_name}
                    disabled={isLoading}
                  />
                ))}
              </FormGroup>
            </Collapse>
          </div>
          <Button
            label={Translate("export", language)}
            onClick={onExportFilterHandler}
            isLoading={isLoadingRep}
          />
        </Modal>
      </div>
    </>
  );
};

const CheckBoxProject = ({
  filterProject,
  setFilterProject,
  projectName,
  disabled,
}) => {
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setToggle(
      filterProject.find((proFilter) => proFilter === projectName) !== undefined
    );
  }, [projectName]);

  const onChange = (e) => {
    setFilterProject(
      toggle
        ? filterProject.filter((p) => p !== projectName)
        : [...filterProject, projectName]
    );
    setToggle(e.target.checked);
  };

  return (
    <FormControlLabel
      label={projectName}
      className="excel-check"
      control={
        <Checkbox checked={toggle} disabled={disabled} onChange={onChange} />
      }
    />
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
