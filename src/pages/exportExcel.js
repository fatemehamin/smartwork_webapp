import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
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
import { exportExcel } from "../redux/action/managerAction";
import jMoment from "moment-jalaali";
import Modal from "../components/modal";
import Button from "../components/Button";
// import Share from "react-native-share";
// import Spinner from "../components/spinner";
import { getProject } from "../redux/action/employeeAction";
// import Collapsible from "react-native-collapsible";

export default () => {
  const [year, setYear] = useState(jMoment(new Date()).jYear());
  const [month, setMonth] = useState(jMoment(new Date()).jMonth());
  const stateManager = useSelector((state) => state.managerReducer);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSnackbar, setIsSnackbar] = useState(false);
  const [indexEmployeeCurrent, setIndexEmployeeCurrent] = useState(0);
  const [isCollapse, setIsCollapse] = useState(false);
  const [FilterProject, setFilterProject] = useState(["entry"]);
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
  const filename = `${employees.name[indexEmployeeCurrent]}_${year}${pad(
    month + 1
  )}_${nowTime}`;
  const getEmployee = () => {
    let number = [];
    let name = [];
    let data = [];
    stateManager.employees.forEach((employee) => {
      number = [...number, employee.phone_number];
      name = [...name, `${employee.first_name} ${employee.last_name}`];
      data = [...data, ""];
    });
    setEmployees(() => ({ number, name, data }));
    setIndexEmployeeCurrent(indexEmployeeCurrent);
    dispatch(getProject());
  };
  const exportFile = (filename) => {
    const wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(stateManager.report.data);
    ws["!merges"] = stateManager.report.config;
    XLSX.utils.book_append_sheet(wb, ws, "ReportSheet");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };
  console.log("ff", FilterProject);
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
  const ExcelFileView = () =>
    stateManager.report != null && (
      <div style={styles.excelFile}>
        <img src={require("../assets/images/excel.png")} style={styles.img} />
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
        <span
          style={styles.iconShare}
          // onPress={onShare}
        >
          <Share />
        </span>
      </div>
    );
  const onRemoveFilterHandler = () => {
    setModalVisible(false);
    setYear(jMoment(new Date()).jYear());
    setMonth(jMoment(new Date()).jMonth());
    setIndexEmployeeCurrent(0);
    setFilterProject(["entry"]);
  };
  const onExportFilterHandler = () => {
    dispatch(
      exportExcel(
        parseInt(year),
        month + 1,
        jMoment.jDaysInMonth(parseInt(year), month),
        employees.number[indexEmployeeCurrent],
        employees.name[indexEmployeeCurrent],
        setModalVisible,
        FilterProject
      )
    );
  };
  const getCheckBoxProject = () =>
    stateManager.projects.map((project, index) => {
      const [toggle, setToggle] = useState(false);
      useEffect(() => {
        setToggle(
          FilterProject.filter((proFilter) => proFilter == project.project_name)
            .length > 0
        );
      }, [
        FilterProject.filter((proFilter) => proFilter == project.project_name)
          .length > 0,
      ]);
      return (
        <FormControlLabel
          key={index}
          control={
            <Checkbox
              checked={toggle}
              disabled={stateManager.isLoading}
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

  return (
    <>
      <AppBar label="Export Excel" />
      <div style={styles.container}>
        <div style={styles.text}>
          Please select the desired date , member or project.
        </div>
        <Button onClick={() => setModalVisible(true)} label="Export Excel" />
        {stateManager.report != null ? (
          <div style={styles.text}>
            Excel {year}/{month + 1} {employees.name[indexEmployeeCurrent]} :
          </div>
        ) : null}
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
                remove filter
              </div>
            </div>
            <div style={{ ...styles.textHeaderModal, paddingRight: 15 }}>
              Export
            </div>
          </div>
          <div style={{ ...styles.sectionContainerModal, marginTop: 50 }}>
            <div style={styles.text}>Choose Date :</div>
            <Calendar
              month={month}
              setMonth={setMonth}
              year={year}
              setYear={setYear}
              isCalendar
            />
          </div>
          <div style={styles.sectionContainerModal}>
            <Calendar
              label="Choose Member : "
              onePicker={{
                data: employees.name,
                init: indexEmployeeCurrent,
                onSelect: (selectItem) => setIndexEmployeeCurrent(selectItem),
              }}
            />
          </div>
          <div style={styles.sectionContainerModal}>
            <div
              style={styles.Collapse}
              onClick={() => setIsCollapse(!isCollapse)}
            >
              <span style={styles.text}>Projects</span>
              {isCollapse ? <ExpandLess /> : <ExpandMore />}
            </div>
            <div>
              <Collapse in={isCollapse} style={styles.contentCollapse}>
                <FormGroup>
                  <FormControlLabel
                    disabled
                    control={<Checkbox checked={true} />}
                    label="entry & exit"
                  />
                  <FormControlLabel
                    disabled
                    control={<Checkbox checked={true} />}
                    label="Daily Report"
                  />
                  {getCheckBoxProject()}
                </FormGroup>
              </Collapse>
            </div>
          </div>
          <Button
            label="Export"
            onClick={onExportFilterHandler}
            isLoading={stateManager.isLoading}
          />
        </Modal>
        {/* <Spinner isLoading={isLoading} /> */}
      </div>
    </>
  );
};
const styles = {
  container: {
    justifyContent: "center",
    display: "flex",
    flexWrap: "wrap",
  },
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
    padding: 20,
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
  sectionContainerModal: {
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 10,
    elevation: 1,
    padding: "15px 0px",
  },
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
