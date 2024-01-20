import React, { useEffect, useState } from "react";
import { ReactComponent as EntryIcon } from "../assets/icons/entry.svg";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchTasks } from "../features/tasks/action";
import { fetchLocationSpacialUser } from "../features/locations/action";
import { setDailyReport, fetchDailyReport } from "../features/reports/action";
import { setMyTaskActiveTab } from "../features/config/configSlice";
import EditIcon from "@mui/icons-material/Edit";
import Task from "../components/task";
import FloatingButton from "../components/floatingButton";
import Modal from "../components/modal";
import Input from "../components/input";
import Alert from "../components/alert";
import "./tabTasks.css";

const TabTasks = () => {
  const { language } = useSelector((state) => state.i18n);
  const { userInfo } = useSelector((state) => state.auth);
  const { dailyReport, isLoading } = useSelector((state) => state.reports);
  const { tasks, currentTask, lastEntry } = useSelector((state) => state.tasks);
  const [openSnackbar] = useSnackbar();
  const [isEnd, setIsEnd] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [dailyReportToday, setDailyReportToday] = useState(dailyReport);
  const [OpenAlert, setOpenAlert] = useState(false);
  const dispatch = useDispatch();
  const closeModal = () => setModalVisible(false);
  const OpenModal = () => setModalVisible(true);

  useEffect(() => {
    userInfo?.phoneNumber &&
      dispatch(fetchLocationSpacialUser(userInfo.phoneNumber))
        .unwrap()
        .catch(_error);
    dispatch(fetchTasks()).unwrap().catch(_error);
    dispatch(fetchDailyReport(new Date().toISOString().slice(0, 10)));
    setDailyReportToday(dailyReport);
  }, [dailyReport, userInfo?.phoneNumber]);

  const getTasks = () =>
    tasks.length > 0 ? (
      tasks.map((t, i) => (
        <Task
          key={i}
          name={t.project_name}
          initialDuration={t.today_duration}
          currentTask={currentTask}
          lastEntry={lastEntry}
          setOpenAlert={setOpenAlert}
          isEmpty={isEnd && t.project_name === currentTask.name}
          setIsEnd={setIsEnd}
          isEnable={
            currentTask.start !== 0 && t.project_name === currentTask.name
          }
        />
      ))
    ) : (
      <div className="text">{Translate("noHaveTask", language)}</div>
    );

  const handleDailyReport = () => {
    setDailyReportToday(dailyReportToday.trim());

    dispatch(
      setDailyReport({
        date: new Date().toISOString().slice(0, 10),
        dailyReport: dailyReportToday.trim(),
      })
    )
      .unwrap()
      .then(closeModal)
      .catch(_error);
  };

  const handleCancelDailyReport = () => {
    closeModal();
    setDailyReportToday(dailyReport);
  };

  const _error = (error) =>
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );

  const propsAlert = {
    open: OpenAlert,
    setOpen: setOpenAlert,
    title: "ENTRY",
    description: "entryFirst",
    Icon: EntryIcon,
    ButtonAction: [
      {
        text: "ok",
        onClick: () => dispatch(setMyTaskActiveTab("entryAndExit")),
      },
    ],
  };

  const propsModal = {
    modalVisible,
    setModalVisible,
    label: "todayReport",
    buttonActions: [
      { text: "ok", action: handleDailyReport, isLoading },
      { text: "cancel", action: handleCancelDailyReport },
    ],
  };

  return (
    <>
      <div className="my-task">{getTasks()}</div>
      <FloatingButton Icon={EditIcon} onClick={OpenModal} />
      <Modal {...propsModal}>
        <Input
          value={dailyReportToday}
          setValue={setDailyReportToday}
          placeholder={Translate("WhatIsDoingToday", language)}
          autoFocus
          multiline
        />
      </Modal>
      <Alert {...propsAlert} />
    </>
  );
};

export default TabTasks;
