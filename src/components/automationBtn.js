import "../pages/tabCartable.css";
import React, { useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import Alert from "../components/alert";
import Modal from "../components/modal";
import dayjs from "dayjs";
import jMoment from "moment-jalaali";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { Grid } from "@mui/material";
import { ReactComponent as SettingAutomationIcon } from "../assets/icons/settings-automation.svg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useSnackbar } from "react-simple-snackbar";
import { ReactComponent as SendMsgIcon } from "../assets/icons/accept_msg.svg";
import { Translate } from "../features/i18n/translate";
import { sendNotification } from "../features/notification/action";
import { addLeaveRequests } from "../features/leaveRequests/action";

const AutomationBtn = ({ openMsgModal }) => {
  const [modalVisibleLeave, setModalVisibleLeave] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLeaveRequestPress, setIsLeaveRequestPress] = useState(false);
  const [explainLeave, setExplainLeave] = useState("");
  const [typeLeave, setTypeLeave] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errorDateTimeEnd, setErrorDateTimeEnd] = useState(null);
  const [errorDateTimeStart, setErrorDateTimeStart] = useState(null);
  const [startTime, setStartTime] = useState(dayjs(new Date()));
  const [endTime, setEndTime] = useState(dayjs(new Date()));
  const [openAuto, setOpenAuto] = useState(false);

  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { language } = useSelector((state) => state.i18n);
  const { isLoading } = useSelector((state) => state.leaveRequest);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const taskAnimation = useSpring({
    opacity: openAuto ? 1 : 0,
    scale: openAuto ? 1 : 0,
    width: "30%",
  });

  const taskBgColor = useSpring({
    backgroundColor: `rgb(${isLeaveRequestPress ? 38 : 255}, ${
      isLeaveRequestPress ? 156 : 255
    }, ${isLeaveRequestPress ? 217 : 255})`,
  });

  const automationBgColor = useSpring({
    backgroundColor: `rgba(38, 156, 217, ${openAuto ? 0.5 : 1})`,
  });

  const disableBtnLeave =
    errorDateTimeEnd !== null || errorDateTimeStart !== null;

  const disablePast =
    startDate.toISOString().slice(0, 10) ===
    new Date().toISOString().slice(0, 10);

  const closeModalLeaveRequest = () => setModalVisibleLeave(false);

  const handelLeaveRequest = () => setIsLeaveRequestPress(true);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const changeToJDate = (d) =>
    `${jMoment(d).jYear()}-${pad(jMoment(d).jMonth() + 1)}-${pad(
      jMoment(d).jDate()
    )}`;

  const handelCancelModal = () => {
    setErrorDateTimeEnd(null);
    setErrorDateTimeStart(null);
    closeModalLeaveRequest();
  };

  const handelModalConfirm = () => {
    if (!errorDateTimeEnd || errorDateTimeStart) {
      setErrorDateTimeEnd(null);
      setErrorDateTimeStart(null);
      closeModalLeaveRequest();
      setOpenAlert(true);
    }
  };

  const handleAuto = () => {
    setOpenAuto((open) => !open);
    setIsLeaveRequestPress(false);
  };

  const onFocusDate = () =>
    setErrorDateTimeEnd(
      startDate > endDate ? Translate("errorEndDateSmaller", language) : null
    );

  const onFocusTime = () => {
    setErrorDateTimeEnd(
      startTime > endTime ? Translate("errorEndTimeSmaller", language) : null
    );

    setErrorDateTimeStart(
      disablePast && startTime <= new Date().getTime()
        ? Translate("errorTimeUnacceptable", language)
        : null
    );
  };

  const slotPropsEnd = (onFocus) => ({
    textField: {
      error: errorDateTimeEnd !== null,
      helperText: errorDateTimeEnd !== null && errorDateTimeEnd,
      onFocus,
    },
  });

  const slotPropsStart = (onFocus) => ({
    textField: {
      onFocus,
      error: errorDateTimeStart !== null,
      helperText: errorDateTimeStart !== null && errorDateTimeStart,
    },
  });

  const getListButtonAuto = () => {
    const handleIllness = () => {
      setModalVisibleLeave(true);
      setTypeLeave("illness");
    };
    const handleDaily = () => {
      setModalVisibleLeave(true);
      setTypeLeave("daily");
    };
    const handleHours = () => {
      setModalVisibleLeave(true);
      setTypeLeave("hours");
    };
    return isLeaveRequestPress
      ? [
          { label: "illness", onClick: handleIllness },
          { label: "daily", onClick: handleDaily },
          { label: "hours", onClick: handleHours },
        ]
      : [
          { label: "taskRequest", onClick: openMsgModal },
          { label: "progress", disabled: true },
          { label: "leaveRequest", onClick: handelLeaveRequest },
        ];
  };

  const handleAddRequestLeave = () => {
    const timeStamp = (time) =>
      new Date(
        jMoment(
          `${changeToJDate(startDate)}-${pad(time.hour())}:${pad(
            time.minute()
          )}`,
          "jYYYY-jM-jD-hh:mm"
        )
      ).getTime();

    const args = {
      type: typeLeave,
      date_leave_from: changeToJDate(startDate),
      date_leave_to: typeLeave === "hours" ? null : changeToJDate(endDate),
      time_leave_from: typeLeave === "hours" ? timeStamp(startTime) : null,
      time_leave_to: typeLeave === "hours" ? timeStamp(endTime) : null,
      message: explainLeave,
      phone_number: phoneNumber,
    };

    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "406"
          ? Translate("dateTimeNotAcceptable", language)
          : error.message
      );
    };

    const _then = (res) => {
      closeModalLeaveRequest();
      dispatch(
        sendNotification({
          msg: Translate("leaveRequest", res.language_boss_for_notification),
          typeNotification: "LEAVE_REQUEST",
          id_data: res.id,
        })
      );
    };

    dispatch(addLeaveRequests(args)).unwrap().then(_then).catch(_error);
  };

  const propsAlert = {
    open: openAlert,
    setOpen: setOpenAlert,
    title: "confirmRequest",
    description: "confirmRequestDescription",
    Icon: SendMsgIcon,
    ButtonAction: [
      { text: "continue", onClick: handleAddRequestLeave, isLoading },
      { text: "cancel", type: "SECONDARY" },
    ],
  };

  const propsModal = {
    modalVisible: modalVisibleLeave,
    setModalVisible: setModalVisibleLeave,
    label: "leaveRequest",
    buttonActions: [
      {
        text: "add",
        action: handelModalConfirm,
        disable: disableBtnLeave,
      },
      { text: "cancel", action: handelCancelModal },
    ],
  };

  return (
    <>
      <Grid container className="automation-container">
        <animated.div
          style={automationBgColor}
          className="automation-btn"
          onClick={handleAuto}
        >
          <SettingAutomationIcon fill="#ffffff" />
          <span className="automation-btn-text">
            {Translate("automation", language)}
          </span>
        </animated.div>

        <Grid container className="automation-task-container">
          {getListButtonAuto().map((b, i) => (
            <Button
              key={i}
              customStyle={{ ...taskAnimation, ...taskBgColor }}
              type={isLeaveRequestPress ? "PRIMARY" : "SECONDARY"}
              onClick={b.onClick}
              label={Translate(b.label, language)}
              disabled={b.disabled}
            />
          ))}
        </Grid>
      </Grid>

      <Modal {...propsModal}>
        {typeLeave !== "hours" ? (
          <div className="automation-date direction">
            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
              <DatePicker
                disablePast
                sx={{ width: "40%" }}
                defaultValue={startDate}
                label={Translate("startDate", language)}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{ textField: { onFocus: onFocusDate } }}
              />
              <DatePicker
                minDate={startDate}
                sx={{ width: "40%" }}
                defaultValue={endDate}
                label={Translate("endDate", language)}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={slotPropsEnd(onFocusDate)}
              />
            </LocalizationProvider>
          </div>
        ) : (
          <>
            <div className="automation-date-time">
              <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
                <DatePicker
                  disablePast
                  sx={{ width: "87%" }}
                  defaultValue={startDate}
                  label={Translate("date", language)}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { onFocus: onFocusTime } }}
                />
              </LocalizationProvider>
            </div>
            <div className="automation-date direction">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  disablePast={disablePast}
                  sx={{ width: "40%" }}
                  defaultValue={startTime}
                  ampm={false}
                  label={Translate("startTime", language)}
                  onChange={(d) => setStartTime(d)}
                  slotProps={slotPropsStart(onFocusTime)}
                  autoFocus
                />
                <TimePicker
                  minTime={startTime}
                  sx={{ width: "40%" }}
                  defaultValue={endTime}
                  ampm={false}
                  label={Translate("endTime", language)}
                  onChange={(d) => setEndTime(d)}
                  slotProps={slotPropsEnd(onFocusTime)}
                />
              </LocalizationProvider>
            </div>
          </>
        )}
        <Input
          value={explainLeave}
          setValue={setExplainLeave}
          placeholder={Translate("explain", language)}
          multiline
        />
      </Modal>

      <Alert {...propsAlert} />
    </>
  );
};

export default AutomationBtn;
