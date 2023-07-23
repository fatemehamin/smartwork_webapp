import React, { useState, useEffect } from "react";
import FloatingButton from "../components/floatingButton";
import Message from "../components/message";
import MsgModal from "../components/msgModal";
import Input from "../components/input";
import Button from "../components/button";
import Alert from "../components/alert";
import Modal from "../components/modal";
import dayjs from "dayjs";
import jMoment from "moment-jalaali";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { Translate } from "../features/i18n/translate";
import { changeStatusMsg, deleteMsg } from "../features/msg/action";
import { Grid } from "@mui/material";
import { ReactComponent as SettingAutomationIcon } from "../assets/images/tabler_settings-automation.svg";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useSnackbar } from "react-simple-snackbar";
import { ReactComponent as SendMsgIcon } from "../assets/images/accept_msg_icon.svg";
import "./tabCartable.css";
import {
  addLeaveRequests,
  changeStatusLeave,
  deleteLeave,
} from "../features/leaveRequests/action";

const TabCartable = ({ activeFilter }) => {
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleLeave, setModalVisibleLeave] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLeaveRequestPress, setIsLeaveRequestPress] = useState(false);
  const [explainLeave, setExplainLeave] = useState("");
  const [typeLeave, setTypeLeave] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [errorDateTime, setErrorDateTime] = useState(null);
  const [startTime, setStartTime] = useState(dayjs(new Date()));
  const [endTime, setEndTime] = useState(dayjs(new Date()));
  const [openAuto, setOpenAuto] = useState(false);
  const { msg } = useSelector((state) => state.msg);
  const { type } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { I18nManager, language } = useSelector((state) => state.i18n);
  const { leaveRequests, isLoading } = useSelector(
    (state) => state.leaveRequest
  );

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [openAuto, activeFilter]);

  const taskAnimation = useSpring({
    opacity: openAuto ? 1 : 0,
    scale: openAuto ? 1 : 0,
    width: "30%",
  });

  const bgColorTransparent = useSpring({
    backgroundColor: `rgba(38, 156, 217, ${openAuto ? 0.5 : 1})`,
  });

  const bgColor = useSpring({
    backgroundColor: `rgb(${isLeaveRequestPress ? 38 : 255}, ${
      isLeaveRequestPress ? 156 : 255
    }, ${isLeaveRequestPress ? 217 : 255})`,
  });

  const bossPhoneNumber =
    type !== "boss" && msg.find((m) => m.from !== phoneNumber)?.from;

  const openModalTaskRequest = () => setModalVisible(true);
  const openModalLeaveRequest = () => setModalVisibleLeave(true);
  const openAlertConfirm = () => setOpenAlert(true);
  const closeModalLeaveRequest = () => setModalVisibleLeave(false);
  const handelLeaveRequest = () => setIsLeaveRequestPress(true);
  const toggleOpenAuto = () => setOpenAuto((open) => !open);
  const pad = (n) => (n < 10 ? "0" + n : n);
  const changeToJDate = (d) =>
    `${jMoment(d).jYear()}-${pad(jMoment(d).jMonth() + 1)}-${pad(
      jMoment(d).jDate()
    )}`;

  const handelCancelModal = () => {
    setErrorDateTime(null);
    closeModalLeaveRequest();
  };

  const handelModalConfirm = () => {
    if (!errorDateTime) {
      setErrorDateTime(null);
      closeModalLeaveRequest();
      openAlertConfirm();
    }
  };

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const handleAuto = () => {
    toggleOpenAuto();
    setIsLeaveRequestPress(false);
  };

  const getListButtonAuto = () =>
    isLeaveRequestPress
      ? [
          {
            label: "illness",
            onClick: () => {
              openModalLeaveRequest();
              setTypeLeave("illness");
            },
          },
          {
            label: "daily",
            onClick: () => {
              openModalLeaveRequest();
              setTypeLeave("daily");
            },
          },
          {
            label: "hours",
            onClick: () => {
              openModalLeaveRequest();
              setTypeLeave("hours");
            },
          },
        ]
      : [
          { label: "taskRequest", onClick: openModalTaskRequest },
          { label: "progress", disabled: true },
          { label: "leaveRequest", onClick: handelLeaveRequest },
        ];

  const getRequests = () => {
    const requests = [...msg, ...leaveRequests];
    let dateGroup = "";
    return requests.length > 0 ? (
      requests
        .sort((a, b) => a.create_time - b.create_time)
        .map((req, i) => {
          let name;
          let typeRequest;
          let project;
          let handelStatus;
          let leaveTime = undefined;
          if (req.type !== undefined) {
            // leave
            name = users.find((u) => {
              return u.phone_number === req.phone_number;
            });
            name = name !== undefined && `${name.first_name} ${name.last_name}`;
            typeRequest = "userRequest";
            project = [
              Translate("leaveRequest", language),
              Translate(req.type, language),
            ];
            handelStatus = (status) => {
              type === "boss"
                ? dispatch(changeStatusLeave({ id: req.id, status }))
                    .unwrap()
                    .catch(_error)
                : dispatch(deleteLeave(req.id)).unwrap().catch(_error);
            };
            const timeFormat = (time) => {
              const date = new Date(time);
              return pad(date.getHours()) + ":" + pad(date.getMinutes());
            };
            leaveTime = {
              startDate: req.date_leave_from.replaceAll("-", "/"),
              endDate: req.date_leave_to?.replaceAll("-", "/"),
              startTime: timeFormat(req.time_leave_from),
              endTime: timeFormat(req.time_leave_to),
            };
          } else {
            // msg
            const userPhoneToShowName =
              type === "boss"
                ? req.from === phoneNumber
                  ? req.to
                  : req.from
                : req.from;

            name = users.find((u) => u.phone_number === userPhoneToShowName);
            name =
              name !== undefined
                ? `${name.first_name} ${name.last_name} ${
                    name.phone_number === phoneNumber
                      ? "(ME)"
                      : type !== "boss"
                      ? "(MANAGER)"
                      : ""
                  }`
                : req.project !== null
                ? `${Translate("group", language)} ${req.project}`
                : Translate("all", language);

            typeRequest = `${
              type === "boss"
                ? req.from === phoneNumber
                  ? "boss"
                  : "user"
                : req.from === phoneNumber
                ? "user"
                : "boss"
            }Request`;
            project = [req.project ? req.project : Translate("all", language)];
            handelStatus = (status) => {
              type === "boss"
                ? dispatch(changeStatusMsg({ id: req.id, status }))
                    .unwrap()
                    .catch(_error)
                : dispatch(deleteMsg(req.id)).unwrap().catch(_error);
            };
          }
          const today = new Date().toISOString().slice(0, 10);
          const date = jMoment(new Date(req.create_time));
          const dateFormat =
            req.create_time !== undefined &&
            today === date.toISOString().slice(0, 10)
              ? Translate("today", language)
              : `${Translate(date.format("jMMMM"), language)} ${date.jDate()}`;
          const isDate = dateGroup !== dateFormat;
          dateGroup = dateFormat;
          return (
            <Grid container justifyContent="center" key={i}>
              {isDate && <div className="bubble">{dateFormat}</div>}
              <Message
                msg={req.msg}
                name={name}
                project={project}
                time={req.create_time}
                typeRequest={typeRequest}
                status={req.status}
                handelStatus={handelStatus}
                leaveTime={leaveTime}
              />
            </Grid>
          );
        })
    ) : (
      <div className={`cartable-no-msg ${I18nManager.isRTL ? "rtl" : "ltr"}`}>
        {Translate("noMessage", language)}
      </div>
    );
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

    dispatch(
      addLeaveRequests({
        type: typeLeave,
        date_leave_from: changeToJDate(startDate),
        date_leave_to: typeLeave === "hours" ? null : changeToJDate(endDate),
        time_leave_from: typeLeave === "hours" ? timeStamp(startTime) : null,
        time_leave_to: typeLeave === "hours" ? timeStamp(endTime) : null,
        message: explainLeave,
        phone_number: phoneNumber,
      })
    )
      .unwrap()
      .then(closeModalLeaveRequest)
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message.slice(-3) === "406"
            ? Translate("dateTimeNotAcceptable", language)
            : error.message
        );
      });
  };

  const buttonActionAlert = [
    {
      text: Translate("continue", language),
      onClick: handleAddRequestLeave,
    },
    { text: Translate("cancel", language), type: "SECONDARY" },
  ];

  const className = {
    msg: `cartable-container-msg ${type === "boss" ? "cartable-mb" : ""}`,
    modalContainerBtn: `container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    taskContainer: `automation-task-container ${
      I18nManager.isRTL ? "rtl" : "ltr"
    }`,
    btnContainer: `container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    autoDate: `automation-date ${I18nManager.isRTL ? "rtl" : "ltr"}`,
  };

  return (
    <div className="cartable-container">
      <div className={className.msg}>{getRequests()}</div>
      {type === "boss" ? (
        <FloatingButton
          type="request"
          setModalVisibleProject={setModalVisible}
        />
      ) : (
        <Grid container className="automation-container">
          <animated.div
            style={bgColorTransparent}
            className="automation-btn"
            onClick={handleAuto}
          >
            <SettingAutomationIcon fill="#ffffff" />
            <span className="automation-btn-text">
              {Translate("automation", language)}
            </span>
          </animated.div>
          <Grid container mt={1} className={className.taskContainer}>
            {getListButtonAuto().map((b, i) => (
              <Button
                key={i}
                customStyle={{ ...taskAnimation, ...bgColor }}
                type={isLeaveRequestPress ? "PRIMARY" : "SECONDARY"}
                onClick={b.onClick}
                label={Translate(b.label, language)}
                disabled={b.disabled}
              />
            ))}
          </Grid>
        </Grid>
      )}
      <MsgModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        userPhoneNumber={type === "boss" ? "" : bossPhoneNumber}
      />
      <Modal
        modalVisible={modalVisibleLeave}
        setModalVisible={setModalVisibleLeave}
      >
        <h2 className="text-center">{Translate("leaveRequest", language)}</h2>
        {typeLeave !== "hours" ? (
          <div className={className.autoDate}>
            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
              <DatePicker
                disablePast
                sx={{ width: "40%" }}
                defaultValue={startDate}
                label={Translate("startDate", language)}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    onFocus: () =>
                      setErrorDateTime(
                        startDate > endDate
                          ? Translate("errorEndDateSmaller", language)
                          : null
                      ),
                  },
                }}
              />
              <DatePicker
                disablePast
                sx={{ width: "40%" }}
                defaultValue={endDate}
                label={Translate("endDate", language)}
                onChange={(newValue) => setEndDate(newValue)}
                slotProps={{
                  textField: {
                    error: errorDateTime !== null,
                    helperText: errorDateTime !== null && errorDateTime,
                    onFocus: () =>
                      setErrorDateTime(
                        startDate > endDate
                          ? Translate("errorEndDateSmaller", language)
                          : null
                      ),
                  },
                }}
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
                />
              </LocalizationProvider>
            </div>
            <div className={className.autoDate}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <TimePicker
                  disablePast
                  sx={{ width: "40%" }}
                  defaultValue={startTime}
                  ampm={false}
                  label={Translate("startTime", language)}
                  onChange={(d) => setStartTime(d)}
                  slotProps={{
                    textField: {
                      onFocus: () =>
                        setErrorDateTime(
                          startTime > endTime
                            ? Translate("errorEndTimeSmaller", language)
                            : null
                        ),
                    },
                  }}
                />
                <TimePicker
                  disablePast
                  sx={{ width: "40%" }}
                  defaultValue={endTime}
                  ampm={false}
                  label={Translate("endTime", language)}
                  onChange={(d) => setEndTime(d)}
                  slotProps={{
                    textField: {
                      error: errorDateTime !== null,
                      helperText: errorDateTime !== null && errorDateTime,
                      onFocus: () =>
                        setErrorDateTime(
                          startTime > endTime
                            ? Translate("errorEndTimeSmaller", language)
                            : null
                        ),
                    },
                  }}
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
        <div className={className.btnContainer}>
          <Button
            label={Translate("add", language)}
            customStyle={{ width: "40%" }}
            isLoading={isLoading}
            onClick={handelModalConfirm}
          />
          <Button
            label={Translate("cancel", language)}
            customStyle={{ width: "40%" }}
            onClick={handelCancelModal}
            type="SECONDARY"
          />
        </div>
      </Modal>
      <Alert
        open={openAlert}
        setOpen={setOpenAlert}
        title={Translate("confirmRequest", language)}
        description={Translate("confirmRequestDescription", language)}
        Icon={SendMsgIcon}
        ButtonAction={buttonActionAlert}
      />
    </div>
  );
};

export default TabCartable;
