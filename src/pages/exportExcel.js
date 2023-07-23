import React, { useState, useEffect } from "react";
import AppBar from "../components/appBar";
import Calendar from "../components/picker";
import * as XLSX from "xlsx";
// import Snackbar from "react-native-snackbar";
import {
  FileDownload,
  Share,
  ExpandLess,
  ExpandMore,
  ArrowBackIos,
} from "@mui/icons-material";
import { Checkbox, Collapse, FormControlLabel, FormGroup } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { exportExcel } from "../features/reports/action";
import jMoment from "moment-jalaali";
import Modal from "../components/modal";
import Button from "../components/button";
import { Translate } from "../features/i18n/translate";
// import Share from "react-native-share";
// import Spinner from "../components/spinner";
// import { getProject } from "../redux/action/employeeAction";
// import Collapsible from "react-native-collapsible";
import "./exportExcel.css";
import { useSnackbar } from "react-simple-snackbar";
import { fetchProject } from "../features/projects/action";
import { fetchUsers } from "../features/users/action";

const ExportExcel = () => {
  const [jYear, setJYear] = useState(jMoment(new Date()).jYear());
  const [jMonth, setJMonth] = useState(jMoment(new Date()).jMonth());
  const { users } = useSelector((state) => state.users);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { projects, isLoading } = useSelector((state) => state.projects);
  const { excelReport } = useSelector((state) => state.reports);

  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading1, setIsLoading] = useState(false);
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [indexEmployeeCurrent, setIndexEmployeeCurrent] = useState(0);
  const [isCollapse, setIsCollapse] = useState(false);
  const [FilterProject, setFilterProject] = useState(["entry"]);
  const [openSnackbar] = useSnackbar();

  const [employees, setEmployees] = useState({
    name: [""],
    number: [],
    data: [],
  });
  const dispatch = useDispatch();
  useEffect(() => {
    getEmployee();
  }, []);
  const pad = (n) => (n < 10 ? "0" + n : n);
  const nowTime = new Date().getTime();
  const filename = `${employees.name[indexEmployeeCurrent]}_${jYear}${pad(
    jMonth + 1
  )}_${nowTime}`;
  const getEmployee = () => {
    dispatch(fetchUsers());
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
    dispatch(fetchProject());
  };
  const exportFile = (filename) => {
    const wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(excelReport.data);
    ws["!merges"] = excelReport.config;
    XLSX.utils.book_append_sheet(wb, ws, "ReportSheet");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };
  // const onShare = () => {
  //   const wbout = exportFile("base64");
  //   const uri = `${RNFS.CachesDirectoryPath}/${filename}.xlsx`;
  //   const base64Excel =
  //     "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," +
  //     wbout;
  //   RNFS.writeFile(uri, wbout, "base64")
  //     .then((res) => {
  //       Share.open({
  //         filename,
  //         url: base64Excel,
  //         type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //       })
  //         .then((res) => {
  //           console.log(res);
  //         })
  //         .catch((err) => {
  //           err && console.log(err);
  //         });
  //     })
  //     .catch((err) => {
  //       Alert.alert("Share Error", "Error " + err.message);
  //     });
  // };
  // console.log("gg");

  const ExcelFileView = () =>
    excelReport != null && (
      <div style={styles.excelFile}>
        <img
          src={require("../assets/images/excel.png")}
          style={styles.img}
          alt="excel"
        />
        <div
          style={{
            ...styles.text,
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {filename}.xlsx
        </div>
        <span onClick={() => exportFile(filename)} style={styles.iconShare}>
          <FileDownload />
        </span>
        {/* <span
          style={styles.iconShare}
          // onPress={onShare}
        >
          <Share />
        </span> */}
      </div>
    );
  const onRemoveFilterHandler = () => {
    setModalVisible(false);
    setJYear(jMoment(new Date()).jYear());
    setJMonth(jMoment(new Date()).jMonth());
    setIndexEmployeeCurrent(0);
    setFilterProject(["entry"]);
  };
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
        FilterProject,
      })
    )
      .unwrap()
      .then((res) => {
        if (res.reports.length <= 0) {
          openSnackbar(Translate("notExistReport", language));
          // dispatch(emptyReport());
        } else {
          setModalVisible(false);
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

  const openModal = () => setModalVisible(true);

  return (
    <>
      <AppBar label="exportExcel" />
      <div className="excel-container">
        <div className="excel-text">
          {Translate("selectDateUserProject", language)}
        </div>
        <Button
          onClick={openModal}
          label={Translate("exportExcel", language)}
        />
        {/* {stateManager.report != null ? (
          <div style={styles.text}>
            {Translate("excel", language)} {JYear}/{jMonth + 1}{" "}
            {employees.name[indexEmployeeCurrent]} :
          </div>
        ) : null} */}
        <ExcelFileView />
        <Modal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          customStyle={styles.customStyleModal}
        >
          <div style={styles.headerModal}>
            <div style={styles.removeFilter} onClick={onRemoveFilterHandler}>
              <span style={styles.backIcon}>
                <ArrowBackIos />
              </span>
              <div style={{ ...styles.textHeaderModal, fontWeight: "500" }}>
                {Translate("removeFilter", language)}
              </div>
            </div>

            <div style={{ ...styles.textHeaderModal, paddingRight: 15 }}>
              {Translate("export", language)}
            </div>
          </div>
          <div
            style={{
              ...styles.sectionContainerModal(I18nManager.isRTL),
              marginTop: 50,
            }}
          >
            <div style={styles.text}>{Translate("date", language)} : </div>
            <Calendar
              month={jMonth}
              setMonth={setJMonth}
              year={jYear}
              setYear={setJYear}
              isCalendar
            />
          </div>
          <div style={styles.sectionContainerModal(I18nManager.isRTL)}>
            <Calendar
              label={`${Translate("user", language)} : `}
              onePicker={{
                data: employees.name,
                init: indexEmployeeCurrent,
                onSelect: (selectItem) => setIndexEmployeeCurrent(selectItem),
              }}
            />
          </div>
          <div style={styles.sectionContainerModal(I18nManager.isRTL)}>
            <div
              style={styles.Collapse}
              onClick={() => setIsCollapse(!isCollapse)}
            >
              <span style={styles.text}>{Translate("projects", language)}</span>
              {isCollapse ? <ExpandLess /> : <ExpandMore />}
            </div>
            <div>
              <Collapse in={isCollapse} style={styles.contentCollapse}>
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
                  {getCheckBoxProject(
                    projects,
                    isLoading,
                    FilterProject,
                    setFilterProject
                  )}
                </FormGroup>
              </Collapse>
            </div>
          </div>
          <Button
            label={Translate("export", language)}
            onClick={onExportFilterHandler}
            // isLoading={stateManager.isLoading}
          />
        </Modal>
        {/* <Spinner isLoading={isLoading1} /> */}
      </div>
    </>
  );
};
const getCheckBoxProject = (
  projects,
  isLoading,
  FilterProject,
  setFilterProject
) => {
  // const { projects, isLoading } = useSelector((state) => state.projects);
  return projects.map((project, index) => {
    const [toggle, setToggle] = useState(false);
    useEffect(() => {
      setToggle(
        FilterProject.filter((proFilter) => proFilter === project.project_name)
          .length > 0
      );
    }, [
      FilterProject.filter((proFilter) => proFilter === project.project_name)
        .length > 0,
    ]);
    return (
      <FormControlLabel
        key={index}
        control={
          <Checkbox
            checked={toggle}
            disabled={isLoading}
            onChange={(e) => {
              toggle
                ? setFilterProject(
                    FilterProject.filter((p) => p !== project.project_name)
                  )
                : setFilterProject([...FilterProject, project.project_name]);
              setToggle(e.target.checked);
            }}
          />
        }
        label={project.project_name}
      />
    );
  });
};
const styles = {
  removeFilter: { alignItems: "center", display: "flex" },
  textHeaderModal: {
    color: "#fff",
    margin: "10px 0px",
    fontWeight: "bold",
    fontSize: 15,
  },
  customStyleModal: {
    height: window.innerHeight,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    backgroundColor: "#f2f2f2",
    padding: 0,
  },
  Collapse: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
    border: "#CACCCF 1px solid",
    padding: "0px 10px",
    margin: "0px 10px",
    borderRadius: 5,
  },
  contentCollapse: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#CACCCF",
    borderStyle: "solid",
    borderTop: "none",
    padding: "0px 20px",
    margin: "0px 10px",
    borderRadius: 5,
  },
  headerModal: {
    justifyContent: "space-between",
    display: "flex",
    alignItems: "center",
    position: "fixed",
    width: "100%",
    height: 50,
    backgroundColor: "#176085",
    zIndex: 3,
  },
  sectionContainerModal: (isRTL) => ({
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 10,
    elevation: 1,
    padding: "15px 0px",
    direction: isRTL ? "rtl" : "ltr",
  }),
  text: {
    color: "#000",
    margin: "10px 0px",
    fontWeight: "500",
    fontSize: 18,
    paddingLeft: 10,
  },
  excelFile: {
    border: "2px solid #008000",
    borderRadius: 5,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    boxShadow: "1px 5px 4px -2px rgba(0,0,0,0.30)",
    backgroundColor: "#fff",
    width: "80%",
    height: 50,
    margin: 10,
  },
  iconShare: {
    padding: 5,
    margin: "0px 2px",
    color: "#008000",
  },
  snackbar: {
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 25,
    elevation: 10,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  snackbarTextContainer: {
    flexDirection: "column",
    width: "70%",
  },
  iconSnackbar: {
    padding: 20,
  },
  img: { width: 20, height: 20, marginLeft: 5 },
  backIcon: { color: "#fff", marginLeft: 10, marginTop: 3 },
};

export default ExportExcel;
