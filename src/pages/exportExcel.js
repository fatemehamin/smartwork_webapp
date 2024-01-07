import React, { useState, useEffect } from "react";
import AppBar from "../components/appBar";
import Calendar from "../components/picker";
import * as XLSX from "xlsx";
import jMoment from "moment-jalaali";
import Modal from "../components/modal";
import Button from "../components/button";
import Excel from "../assets/icons/excel.svg";
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
  const { language } = useSelector((state) => state.i18n);
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { excelReport, isLoading: isLoadingRep } = useSelector(
    (state) => state.reports
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchProject());
  }, []);

  const pad = (n) => (n < 10 ? "0" + n : n);
  const nowTime = new Date().getTime();
  const filename = `${employees.name[indexEmployeeCurrent]}_${jYear}${pad(
    jMonth + 1
  )}_${nowTime}`;

  const getEmployee = () => {
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

  const exportFile = (filename) => {
    const wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(excelReport.data);
    ws["!merges"] = excelReport.config;
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
    getEmployee();
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
