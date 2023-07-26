import React, { useEffect, useState } from "react";
import { ReactComponent as EntryIcon } from "../assets/images/entry.svg";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchTasks } from "../features/tasks/action";
import { fetchLocationSpacialUser } from "../features/locations/action";
import { setDailyReport, fetchDailyReport } from "../features/reports/action";
import Task from "../components/task";
import FloatingButton from "../components/floatingButton";
import Modal from "../components/modal";
import Input from "../components/input";
import Button from "../components/button";
import Alert from "../components/alert";
import "./tabTasks.css";

const TabTasks = ({ setActiveFilter }) => {
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
    dispatch(
      setDailyReport({
        date: new Date().toISOString().slice(0, 10),
        dailyReport: dailyReportToday,
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

  const buttonAction = [
    {
      text: Translate("ok", language),
      onClick: () => setActiveFilter("entryAndExit"),
    },
  ];

  return (
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
        <div className="container_btn_row direction">
          <Button
            label={Translate("ok", language)}
            customStyle={{ width: "40%" }}
            isLoading={isLoading}
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
      <Alert
        open={OpenAlert}
        setOpen={setOpenAlert}
        title={Translate("ENTRY", language)}
        description={Translate("entryFirst", language)}
        Icon={EntryIcon}
        ButtonAction={buttonAction}
      />
    </>
  );
};

export default TabTasks;
