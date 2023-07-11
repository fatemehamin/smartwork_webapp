import React, { useEffect, useState } from "react";
import { ReactComponent as EntryIcon } from "../assets/images/entry.svg";
import { ReactComponent as LocationErrorIcon } from "../assets/images/locationErrorIcon.svg";
import Task from "../components/task";
import AppBar from "../components/appBar";
import FloatingButton from "../components/floatingButton";
import Modal from "../components/modal";
import Input from "../components/input";
import Button from "../components/button";
import Tabs from "../components/tabs";
import Alert from "../components/alert";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { useSwipeable } from "react-swipeable";
import { animated, useSpring } from "@react-spring/web";
import { MapContainer, TileLayer } from "react-leaflet";
import checkLocation from "../utils/checkLocation";
import LocateControl from "../utils/locatecontrol";
import { Login, Logout } from "@mui/icons-material";
import { Translate } from "../features/i18n/translate";
import { endTime, entry, exit, fetchTasks } from "../features/tasks/action";
import { fetchLocationSpacialUser } from "../features/locations/action";
import { setIsLoading } from "../features/tasks/tasksSlice";
import { setDailyReport, fetchDailyReport } from "../features/reports/action";
import Cartable from "./cartable";
import "./myTask.css";

const MyTask = () => {
  const locations = useSelector((state) => state.locations.locationSpacialUser);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { type, userInfo } = useSelector((state) => state.auth);
  const { dailyReport, isLoading: isLoadingDR } = useSelector(
    (state) => state.reports
  );
  const { tasks, currentTask, lastEntry, isLoading } = useSelector(
    (state) => state.tasks
  );
  const dispatch = useDispatch();
  const [openSnackbar] = useSnackbar();
  const [isEntry, setIsEntry] = useState(false);
  const [isOpenAlert, setIsOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [locationDenied, setLocationDenied] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("entryAndExit");
  const [dailyReportToday, setDailyReportToday] = useState(dailyReport);
  const [width, api] = useSpring(() => ({ from: { width: "44px" } }));

  useEffect(() => {
    setIsEntry(lastEntry ? true : false);
    dispatch(fetchLocationSpacialUser(userInfo.phoneNumber))
      .unwrap()
      .catch(_error);
    dispatch(fetchTasks())
      .unwrap()
      .then((res) => setActiveFilter(isEntry ? "tasks" : "entryAndExit"))
      .catch(_error);
    dispatch(fetchDailyReport(new Date().toISOString().slice(0, 10)));
    setDailyReportToday(dailyReport);
  }, [dailyReport, lastEntry, userInfo.phoneNumber, isEntry]);

  const FullWidth = () =>
    api.start({ from: { width: "44px" }, to: { width: "200px" } });

  const emptyWidth = () =>
    api.start({ from: { width: "200px" }, to: { width: "44px" } });

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const alert = {
    locationNotCorrect: {
      title: Translate("location", language),
      description: Translate("errorLocationNotCorrect", language),
      Icon: LocationErrorIcon,
      ButtonAction: [{ text: Translate("ok", language) }],
    },
    locationDenied: {
      title: Translate("locationDenied", language),
      description: locationDenied,
      Icon: LocationErrorIcon,
      ButtonAction: [{ text: Translate("ok", language) }],
    },
    entryFirst: {
      title: Translate("ENTRY", language),
      description: Translate("entryFirst", language),
      Icon: EntryIcon,
      ButtonAction: [
        {
          text: Translate("ok", language),
          onClick: () => setActiveFilter("entryAndExit"),
        },
      ],
    },
  };

  const ExitEntry = () => (
    <div className="exit-entry-row" style={styles.exitEntry}>
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
            {Translate(isEntry ? "exit" : "entry", language)}
          </p>
        </div>
      </div>
    </div>
  );

  const handlers = useSwipeable({
    onSwiped: (eventData) => {
      FullWidth();
      setTimeout(() => {
        if (!isLoading) {
          dispatch(setIsLoading(true));
          locations.length > 0
            ? navigator.geolocation.getCurrentPosition(onSuccess, onError)
            : exitEntryHandler();
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
      dispatch(setIsLoading(false));
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
    const _exit = () => {
      dispatch(
        exit({ phoneNumber: userInfo.phoneNumber, isExitWithBoss: false })
      )
        .unwrap()
        .then(() => {
          setIsEntry(false);
          emptyWidth();
        })
        .catch((error) => {
          openSnackbar(
            error.code === "ERR_NETWORK"
              ? Translate("connectionFailed", language)
              : error.message
          );
          emptyWidth();
        });
    };

    isEntry
      ? currentTask.start // if have enable task first all task disable then exit
        ? dispatch(
            endTime({
              name: currentTask.name,
              phoneNumber: userInfo.phoneNumber,
            })
          )
            .unwrap()
            .then(_exit)
            .catch((error) =>
              openSnackbar(
                error.code === "ERR_NETWORK"
                  ? Translate("connectionFailed", language)
                  : error.message
              )
            )
        : _exit()
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
      tasks.map((t, i) => (
        <Task
          key={i}
          name={t.project_name}
          initialDuration={t.today_duration}
          currentTask={currentTask}
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
      .then(closeModal)
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  };

  const closeModal = () => setModalVisible(false);

  const handleCancelDailyReport = () => {
    closeModal();
    setDailyReportToday(dailyReport);
  };

  const styles = {
    map: {
      height:
        window.innerHeight > window.innerWidth
          ? (window.innerHeight * 2) / 3
          : window.innerHeight / 2,
    },
    exitEntry: {
      height:
        window.innerHeight > window.innerWidth
          ? window.innerHeight / 3 - 106
          : window.innerHeight / 2 - 116,
    },
  };

  const className = {
    exitEntry: `exit-entry ${isLoading ? "exit-entry-disable" : ""} ${
      isEntry ? "exit" : "entry"
    }${isLoading ? "-disable" : ""}`,
    exitEntryText: `exit-entry-text ${isEntry ? "exit-text" : "entry-text"}${
      isLoading ? "-disable" : ""
    }`,
    containerBtn: `container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`,
  };

  return (
    <>
      <AppBar label={type === "boss" ? "myTasks" : "Smart Work"} />
      <Tabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        titles={
          type === "boss"
            ? ["entryAndExit", "tasks"]
            : ["entryAndExit", "tasks", "cartable"]
        }
      />
      {activeFilter === "entryAndExit" ? (
        <>
          <MapContainer
            center={{ lat: 35.720228, lng: 51.39396 }}
            zoom={13}
            scrollWheelZoom={false}
            className="map"
            style={styles.map}
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
            <div className={className.containerBtn}>
              <Button
                label={Translate("ok", language)}
                customStyle={{ width: "40%" }}
                isLoading={isLoadingDR}
                onClick={handleDailyReport}
              />
              <Button
                label={Translate("cancel", language)}
                customStyle={{ width: "40%" }}
                onClick={handleCancelDailyReport}
                type="SECONDARY"
              />
            </div>
          </Modal>
        </>
      ) : (
        <Cartable />
      )}
      <Alert
        {...alert[alertType]}
        open={isOpenAlert}
        setOpen={setIsOpenAlert}
      />
    </>
  );
};

export default MyTask;
