/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useCallback, useState } from "react";
import Task from "../components/Task";
import "./myTask.css";
import AppBar from "../components/AppBar";
import {
  getProject,
  dailyReport,
  entry,
  exit,
  location,
  // location,
} from "../redux/action/employeeAction";
import {
  getEmployee,
  getProject as allProject,
} from "../redux/action/managerAction";
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
import { Translate } from "../i18n";

export default () => {
  const employeeState = useSelector((state) => state.employeeReducer);
  const { language, I18nManager } = useSelector((state) => state.configReducer);

  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isEntry, setIsEntry] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [isErrorAlert, setIsErrorAlert] = useState(false);
  const [locationDenied, setLocationDenied] = useState({
    status: false,
    error: null,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tasks");
  const [openAlert, setOpenAlert] = useState(false);
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
      <p className="exitEntryText" style={styles.entryExitText(isEntry)}>
        {isEntry ? Translate("exit", language) : Translate("entry", language)}
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
    employeeState.locations.filter((location) =>
      checkLocation(
        {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        location,
        location.radius
      )
    ).length > 0
      ? exitEntryHandler()
      : setIsErrorAlert(true);
  };
  const onError = (error) => {
    setLocationDenied({ error: error.message, status: true });
    return (
      <Alert
        title={Translate("locationDenied", language)}
        description={error.message}
        open={locationDenied.status}
        setOpen={(s) => console.log(s)}
      />
    );
  };

  useEffect(() => {
    //   onRefresh();
    setIsEntry(employeeState.lastEntry ? true : false);
    // Permission();
    dispatch(getEmployee());
    dispatch(allProject());
    dispatch(location(authState.user.phoneNumber));
    dispatch(getProject());
    setDailyReportToday(employeeState.dailyReport.dailyReport);
    isPress && employeeState.isError && openSnackbar(employeeState.error);
  }, [
    employeeState.dailyReport.dailyReport,
    employeeState.lastEntry,
    employeeState.isError,
    authState.user.phoneNumber,
  ]);
  const getTasks = () => {
    return employeeState.projects?.length > 1 ? (
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
      <div className="text">{Translate("noHaveTask", language)}</div>
    );
  };

  return (
    <>
      <AppBar
        label={
          authState.type === "boss"
            ? Translate("myTasks", language)
            : "Smart Work"
        }
      />
      <div className="filterContainer">
        <div
          className={`filter ${activeFilter === "Tasks" && "activeFilter"}`}
          onClick={() => setActiveFilter("Tasks")}
        >
          <p className="filterText">{Translate("tasks", language)}</p>
        </div>
        <div
          className={`filter ${activeFilter === "Map" && "activeFilter"}`}
          onClick={() => setActiveFilter("Map")}
        >
          <p className="filterText">{Translate("map", language)}</p>
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
            <h2 className="labelModal">{Translate("todayReport", language)}</h2>
            <Input
              value={dailyReportToday}
              setValue={setDailyReportToday}
              placeholder={Translate("WhatIsDoingToday", language)}
              autoFocus
              multiline
            />
            <div
              className="buttonsContainer"
              style={styles.buttonsContainer(I18nManager.isRTL)}
            >
              <Button
                label={Translate("ok", language)}
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
              <Button
                label={Translate("cancel", language)}
                customStyle={{ width: "40%" }}
                onClick={() => {
                  setModalVisible(false);
                  setDailyReportToday(employeeState.dailyReport.dailyReport);
                }}
                type="SECONDARY"
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
        title={Translate("ENTRY", language)}
        description={Translate("entryFirst", language)}
        open={openAlert}
        setOpen={setOpenAlert}
        ButtonAction={[{ text: "Ok" }]}
      />
      <Alert
        title={Translate("location", language)}
        description={Translate("errorLocationNotCorrect", language)}
        open={isErrorAlert}
        setOpen={setIsErrorAlert}
      />
      <Alert
        title={Translate("locationDenied", language)}
        description={locationDenied.error}
        open={locationDenied.status}
        setOpen={(s) => setLocationDenied({ ...locationDenied, status: s })}
      />
      {/* <Spinner
        // isLoading={true}
        isLoading={employeeState.isLoading ? true : employeeState.isLoading}
      /> */}
    </>
  );
};

const styles = {
  entryExitText: (isEntry) => ({ color: isEntry ? "red" : "#008800" }),
  buttonsContainer: (isRTL) => ({
    direction: isRTL ? "rtl" : "ltr",
  }),
};
