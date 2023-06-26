import React, { useEffect, useCallback, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { animated, useSpring } from "@react-spring/web";
import Task from "../components/task";
import "./myTask.css";
import AppBar from "../components/appBar";
// import {
//   getProject,
//   // dailyReport,
//   location,
// } from "../redux/action/employeeAction";
// import {
//   getEmployee,
//   getProject as allProject,
// } from "../redux/action/managerAction";
import FloatingButton from "../components/floatingButton";
import Modal from "../components/modal";
import Input from "../components/input";
import Button from "../components/button";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { useNavigate } from "react-router-dom";
import Alert from "../components/alert";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import checkLocation from "../utils/checkLocation";
import Spinner from "../components/spinner";
import LocateControl from "../utils/locatecontrol";
import { Translate } from "../features/i18n/translate";
import Tabs from "../components/tabs";
import { Login, Logout } from "@mui/icons-material";
import { endTime, entry, exit, fetchTasks } from "../features/tasks/action";
import { fetchLocationSpacialUser } from "../features/locations/action";
import { setIsLoading } from "../features/tasks/tasksSlice";
import { setDailyReport, fetchDailyReport } from "../features/reports/action";

const MyTask = () => {
  const locations = useSelector((state) => state.locations.locationSpacialUser);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { type, userInfo } = useSelector((state) => state.auth);
  const { dailyReport } = useSelector((state) => state.reports);
  const { tasks, currentTask, lastEntry, isLoading } = useSelector(
    (state) => state.tasks
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openSnackbar] = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isEntry, setIsEntry] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [locationDenied, setLocationDenied] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("entryAndExit");
  const [openAlert, setOpenAlert] = useState(false);
  const [dailyReportToday, setDailyReportToday] = useState(dailyReport);
  const [position, setPosition] = useState(0);
  const [width, api] = useSpring(() => ({ from: { width: "44px" } }));

  const FullWidth = () =>
    api.start({ from: { width: "44px" }, to: { width: "200px" } });

  const emptyWidth = () =>
    api.start({ from: { width: "200px" }, to: { width: "44px" } });

  const alert = {
    locationNotCorrect: {
      title: Translate("location", language),
      description: Translate("errorLocationNotCorrect", language),
      Icon: () => <div>icon</div>, // ------------------------need icon ----------------//
      ButtonAction: [{ text: Translate("ok", language) }],
    },
    locationDenied: {
      title: Translate("locationDenied", language),
      description: locationDenied,
      Icon: () => <div>icon</div>, // ------------------------need icon ----------------//
      ButtonAction: [{ text: Translate("ok", language) }],
    },
    entryFirst: {
      title: Translate("ENTRY", language),
      description: Translate("entryFirst", language),
      Icon: () => <div>icon</div>, // ------------------------need icon ----------------//
      ButtonAction: [{ text: Translate("ok", language) }],
    },
  };

  const className = {
    exitEntry: `exit-entry ${isLoading ? "exit-entry-disable" : ""} ${
      isEntry ? "exit" : "entry"
    }${isLoading ? "-disable" : ""}`,
    exitEntryText: `exit-entry-text ${isEntry ? "exit-text" : "entry-text"}${
      isLoading ? "-disable" : ""
    }`,
  };

  const ExitEntry = () => (
    <div
      className="exit-entry-row"
      style={{
        height:
          window.innerHeight > window.innerWidth
            ? window.innerHeight / 3 - 106
            : window.innerHeight / 2 - 116,
      }}
    >
      <div className="exit-entry-outline">
        <div className="exit-entry-inline">
          <animated.div
            className={className.exitEntry}
            style={width}
            {...handlers}
          >
            {isEntry ? (
              <Logout color="white" fontSize="small" />
            ) : (
              <Login color="white" fontSize="small" />
            )}
          </animated.div>
          <p className={className.exitEntryText}>
            {isEntry
              ? Translate("exit", language)
              : Translate("entry", language)}
          </p>
        </div>
      </div>
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

  useEffect(() => {
    //   onRefresh();
    setIsEntry(lastEntry ? true : false);
    // dispatch(getEmployee());
    // dispatch(allProject());
    dispatch(fetchLocationSpacialUser(userInfo.phoneNumber))
      .unwrap()
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
    dispatch(fetchTasks())
      .unwrap()
      .then((res) => {
        setActiveFilter(isEntry ? "tasks" : "entryAndExit");
      })
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });

    dispatch(fetchDailyReport(new Date().toISOString().slice(0, 10)));
    setDailyReportToday(dailyReport);
    // isPress && employeeState.isError && openSnackbar(employeeState.error);
  }, [
    // employeeState.dailyReport.dailyReport,
    // employeeState.lastEntry,
    // employeeState.isError,
    userInfo.phoneNumber,
    isEntry,
  ]);

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      FullWidth();
      setTimeout(() => {
        dispatch(setIsLoading(true));
        if (locations.length > 0) {
          navigator.geolocation.getCurrentPosition(onSuccess, onError);
        } else {
          exitEntryHandler();
        }
      }, 900);
    },
  });

  const onSuccess = (position) => {
    if (
      locations.filter((location) =>
        checkLocation(
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          location,
          location.radius
        )
      ).length > 0
    ) {
      exitEntryHandler();
    } else {
      emptyWidth();
      setIsOpenAlert(true);
      setAlertType("locationNotCorrect");
      dispatch(setIsLoading(true));
    }
  };

  const onError = (error) => {
    emptyWidth();
    setLocationDenied(error.message);
    setAlertType("locationDenied");
    setIsOpenAlert(true);
    dispatch(setIsLoading(false));
  };

  const exitEntryHandler = () => {
    isEntry
      ? currentTask.start // if have enable task first all task disable then exit
        ? dispatch(
            endTime({
              name: currentTask.name,
              phoneNumber: userInfo.phoneNumber,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(exit())
                .unwrap()
                .then(() => {
                  setIsEntry(false);
                  emptyWidth();
                })
                .catch(emptyWidth);
            })
        : dispatch(exit())
            .unwrap()
            .then(() => {
              setIsEntry(false);
              emptyWidth();
            })
            .catch(emptyWidth)
      : dispatch(entry())
          .unwrap()
          .then(() => {
            setIsEntry(true);
            emptyWidth();
            setActiveFilter("tasks");
          });
  };

  const getTasks = () => {
    return tasks.length > 0 ? (
      tasks.map((t, index) => (
        <Task
          name={t.project_name}
          initialDuration={t.today_duration}
          currentTask={currentTask}
          key={index}
          lastEntry={lastEntry}
          setOpenAlert={setIsOpenAlert}
          setAlertType={setAlertType}
        />
      ))
    ) : (
      <div className="text">{Translate("noHaveTask", language)}</div>
    );
  };

  const handleDailyReport = () => {
    dispatch(
      setDailyReport({
        date: new Date().toISOString().slice(0, 10),
        dailyReport: dailyReportToday,
      })
    )
      .unwrap()
      .then(() => setModalVisible(false))
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  };

  const closeModal = () => {
    setModalVisible(false);
    // setDailyReportToday(employeeState.dailyReport.dailyReport);
  };

  return (
    <>
      <AppBar label={type === "boss" ? "myTasks" : "Smart Work"} />
      <Tabs
        titles={["entryAndExit", "tasks", "cartable"]}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      {activeFilter === "entryAndExit" ? (
        <>
          <MapContainer
            center={{ lat: 35.720228, lng: 51.39396 }}
            zoom={13}
            scrollWheelZoom={false}
            className="map"
            style={{
              height:
                window.innerHeight > window.innerWidth
                  ? (window.innerHeight * 2) / 3
                  : window.innerHeight / 2,
            }}
          >
            <LocateControl />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </MapContainer>
          <ExitEntry />
        </>
      ) : activeFilter === "tasks" ? (
        <>
          <div className="my-task">{getTasks()}</div>
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
              className={`container_btn_row ${
                I18nManager.isRTL ? "rtl" : "ltr"
              }`}
            >
              <Button
                label={Translate("ok", language)}
                customStyle={{ width: "40%" }}
                // isLoading={employeeState.isLoading}
                onClick={handleDailyReport}
              />
              <Button
                label={Translate("cancel", language)}
                customStyle={{ width: "40%" }}
                onClick={closeModal}
                type="SECONDARY"
              />
            </div>
          </Modal>
        </>
      ) : (
        <div>cartable</div>
      )}
      <Alert
        {...alert[alertType]}
        open={isOpenAlert}
        setOpen={setIsOpenAlert}
      />

      {/* <Spinner
        // isLoading={true}
        isLoading={employeeState.isLoading ? true : employeeState.isLoading}
      /> */}
    </>
  );
};

// const DotBadge = ({ setIsPressMore, isPressMore }) => {
//   const [invisible, setInvisible] = useState(false);
//   const handleBadgeVisibility = () => {
//     setInvisible(!invisible);
//     setIsPressMore(!isPressMore);
//   };

//   return (
//     <Badge
//       color="secondary"
//       variant="dot"
//       className="box-member-icon"
//       invisible={invisible}
//       onClick={handleBadgeVisibility}
//       style={styles.morePress(isPressMore)}
//     >
//       <MoreHorizOutlined />
//     </Badge>
//   );
// };

export default MyTask;
