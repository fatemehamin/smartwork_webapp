import React, { useEffect, useCallback, useState } from "react";
import Task from "../components/Task";
import "./myTask.css";
import AppBar from "../components/AppBar";
import {
  getProject,
  dailyReport,
  entry,
  exit,
  // location,
} from "../redux/action/employeeAction";
import { getEmployee } from "../redux/action/managerAction";
import FloatingButton from "../components/floatingButton";
import Modal from "../components/modal";
import Input from "../components/Input";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { useNavigate } from "react-router-dom";
import Alert from "../components/Alert";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import checkLocation from "../utils/checkLocation";
import Spinner from "../components/spinner";
import LocateControl from "../utils/locatecontrol";

export default () => {
  const employeeState = useSelector((state) => state.employeeReducer);
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isEntry, setIsEntry] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tasks");
  const [openAlert, setOpenAlert] = useState(false);
  const styles = { entryExitText: { color: isEntry ? "red" : "#008800" } };
  const [dailyReportToday, setDailyReportToday] = useState(
    employeeState.dailyReport.dailyReport
  );
  const isGrantedFunction = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // when location add for each employee
        employeeState.locations.filter((location) =>
          checkLocation(
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            location,
            location.radius
          )
        ).length > 0 ? (
          exitEntryHandler()
        ) : (
          <Alert
            title="LOCATION"
            description="You are not in a defined location. If you are in location, please restart your location."
            open={isErrorAlert}
            setOpen={setIsErrorAlert}
          />
        );
      },
      (err) => {
        console.log("location check err", err);
      }
    );
  };
  const isDeniedFunction = () => {
    <Alert
      title="LOCATION DENIED"
      description="location permission denied"
      open={isErrorAlert}
      setOpen={setIsErrorAlert}
    />;
  };

  const exitEntryHandler = () => {
    setIsPress(true);
    const nowTime = new Date().getTime();
    isEntry
      ? employeeState.currentTask.start // when exit all task disable
        ? dispatch(
            exit(
              nowTime,
              setIsEntry,
              employeeState.currentTask.name,
              setIsPress
            )
          )
        : dispatch(exit(nowTime, setIsEntry, undefined, setIsPress))
      : dispatch(entry(nowTime, setIsEntry, setIsPress));
  };
  const ExitEntry = () => (
    <div
      className="exitEntry"
      // disabled={isLoadingButton}
      onClick={() => {
        if (employeeState.locations.length > 0) {
          navigator.geolocation.getCurrentPosition(onSuccess, onError);
          // isGrantedFunction();
          // Permission(
          //   PERMISSIONS_TYPE.location,
          //   isGrantedFunction,
          //   isDeniedFunction,
          //   setIsLoadingButton
          // ))
        } else {
          exitEntryHandler();
        }
      }}
    >
      <p className="exitEntryText" style={styles.entryExitText}>
        {isEntry ? "E     X     I     T" : "E    N    T    R    Y"}
      </p>
    </div>
  );
  // const onRefresh = useCallback(() => {
  //   // setRefreshing(false);
  //   dispatch(getProject());
  //   dispatch(getEmployee());
  // dispatch(location(authState.user.phoneNumber));
  //   NetInfo.fetch().then((netInfo) => {
  //     setIsConnected(netInfo.isConnected);
  //   });
  // }, []);
  const onSuccess = (position) => {
    console.log("success", position);
    employeeState.locations.filter((location) =>
      checkLocation(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        location,
        location.radius
      )
    ).length > 0 ? (
      exitEntryHandler()
    ) : (
      <Alert
        title="LOCATION"
        description="You are not in a defined location. If you are in location, please restart your location."
        open={isErrorAlert}
        setOpen={setIsErrorAlert}
      />
    );
  };
  const onError = (error) => {
    console.log("error", error.message);
    return (
      <Alert
        title="LOCATION DENIED"
        description={error.message}
        open={isErrorAlert}
        setOpen={setIsErrorAlert}
      />
    );
  };

  useEffect(() => {
    //   onRefresh();
    setIsEntry(employeeState.lastEntry ? true : false);
    // Permission();
    // dispatch(location(authState.user.phoneNumber));
    dispatch(getProject());
    setDailyReportToday(employeeState.dailyReport.dailyReport);
    isPress && employeeState.isError && openSnackbar(employeeState.error);
  }, [
    employeeState.dailyReport.dailyReport,
    employeeState.lastEntry,
    employeeState.isError,
  ]);
  const getTasks = () => {
    return employeeState.projects !== null ? (
      employeeState.projects.map((project, index) => (
        <Task
          name={project.project_name}
          initialDuration={project.duration}
          currentTask={employeeState.currentTask}
          key={index}
          lastEntry={employeeState.lastEntry}
          setOpenAlert={setOpenAlert}
          setIsPress={setIsPress}
        />
      ))
    ) : (
      <div className="text">
        The manager has not defined a project for you at this time.
      </div>
    );
  };
  return (
    <>
      <AppBar label={authState.type === "boss" ? "My Tasks" : "Smart Work"} />
      <div className="filterContainer">
        <div
          className={`filter ${activeFilter === "Tasks" && "activeFilter"}`}
          onClick={() => setActiveFilter("Tasks")}
        >
          <p className="filterText">Tasks</p>
        </div>
        <div
          className={`filter ${activeFilter === "Map" && "activeFilter"}`}
          onClick={() => setActiveFilter("Map")}
        >
          <p className="filterText">Map</p>
        </div>
      </div>
      {activeFilter === "Tasks" ? (
        <>
          <div className="employee">{getTasks()}</div>
          <FloatingButton
            type="DailyReport"
            setModalVisibleProject={setModalVisible}
          />
          <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
            <h2 className="labelModal">Today Report</h2>
            <Input
              value={dailyReportToday}
              setValue={setDailyReportToday}
              placeholder="what's doing today?"
              autoFocus
              multiline
            />
            <div className="buttonsContainer">
              <Button
                label="Cancel"
                customStyle={{ width: "40%" }}
                onClick={() => {
                  setModalVisible(false);
                  setDailyReportToday(employeeState.dailyReport.dailyReport);
                }}
                type="SECONDARY"
              />
              <Button
                label="OK"
                customStyle={{ width: "40%" }}
                isLoading={employeeState.isLoading}
                onClick={() => {
                  setIsPress(true);
                  dispatch(
                    dailyReport(
                      new Date().toISOString().slice(0, 10),
                      dailyReportToday,
                      setModalVisible,
                      !modalVisible,
                      undefined,
                      setIsPress
                    )
                  );
                }}
              />
            </div>
          </Modal>
        </>
      ) : (
        <MapContainer
          center={{ lat: 35.720228, lng: 51.39396 }}
          zoom={13}
          scrollWheelZoom={false}
          className="map"
          style={{ height: window.innerHeight - 150 }}
        >
          <LocateControl />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </MapContainer>
      )}
      <ExitEntry />
      <Alert
        title="ENTRY"
        description="Please entry first and then start the task."
        open={openAlert}
        setOpen={setOpenAlert}
        ButtonAction={[{ text: "Ok" }]}
      />
      {/* <Spinner
        // isLoading={true}
        isLoading={employeeState.isLoading ? true : employeeState.isLoading}
      /> */}
    </>
  );
};
