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
import NotesIcon from "@mui/icons-material/Notes";
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
import { changeStatusMsg, deleteMsg, fetchMsg } from "../features/msg/action";
import { fetchTasksLog } from "../features/tasks/action";
import { fetchUsers } from "../features/users/action";
import { sendNotification } from "../features/notification/action";
import { UpdateIsNewMsg } from "../features/msg/msgSlice";
import { updateIsNewLog } from "../features/tasks/tasksSlice";
import { UpdateIsNewLeave } from "../features/leaveRequests/leaveRequestSlice";
import "./tabCartable.css";
import {
  addLeaveRequests,
  changeStatusLeave,
  deleteLeave,
  fetchLeaveRequests,
} from "../features/leaveRequests/action";

const TabCartable = () => {
  const [modalVisible, setModalVisible] = useState(false);
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

  const { taskLogList, isNewLog } = useSelector((state) => state.tasks);
  const { type } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { I18nManager, language } = useSelector((state) => state.i18n);
  const { msg, isNewMsg } = useSelector((state) => state.msg);
  const { leaveRequests, isLoading, isNewLeave } = useSelector(
    (state) => state.leaveRequest
  );
  const { managerActiveTab, cartableFilter, myTaskActiveTab } = useSelector(
    (state) => state.config
  );

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
    dispatch(UpdateIsNewMsg(false));
    dispatch(updateIsNewLog(false));
    dispatch(UpdateIsNewLeave(false));
  }, [
    openAuto,
    isLoading,
    managerActiveTab,
    myTaskActiveTab,
    isNewMsg,
    isNewLog,
    isNewLeave,
  ]);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
    dispatch(fetchMsg());
    dispatch(fetchUsers());
    dispatch(fetchTasksLog());
  }, []);

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

  const openModalTaskRequest = () => setModalVisible(true);

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
          { label: "taskRequest", onClick: openModalTaskRequest },
          { label: "progress", disabled: true },
          { label: "leaveRequest", onClick: handelLeaveRequest },
        ];
  };

  const getRequests = () => {
    const findUser = (phone) => users.find((u) => u.phone_number === phone);
    const sortByDate = (a, b) => a.create_time - b.create_time;
    const timeFormat = (time) => {
      const date = new Date(time);
      return pad(date.getHours()) + ":" + pad(date.getMinutes());
    };
    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    };
    const getFilterUser = (req) => {
      const checkUserInGroup = (project) =>
        findUser(cartableFilter).project_list.find(
          (p) => p.project_name === project
        ) !== undefined;

      return (
        req.phone_number === cartableFilter ||
        req.to === cartableFilter ||
        req.from === cartableFilter ||
        (req.to === null &&
          (req.project === null || checkUserInGroup(req.project)))
      );
    };
    const mapRequest = (req, i) => {
      const getRequestList = () => {
        // leave Request
        if (req.type !== undefined) {
          const getName = () => {
            return user ? `${user.first_name} ${user.last_name}` : undefined;
          };

          const handelStatus = (status) => {
            type === "boss"
              ? dispatch(changeStatusLeave({ id: req.id, status }))
                  .unwrap()
                  .then((res) => {
                    dispatch(
                      sendNotification({
                        msg: Translate(
                          status === "accept"
                            ? "RequestAccepted"
                            : "RequestRejected",
                          language
                        ),
                        typeNotification: "REQUEST_ANSWER",
                        to: req.phone_number,
                        id_data: res.id,
                        request: "leave",
                      })
                    );
                  })
                  .catch(_error)
              : dispatch(deleteLeave(req.id)).unwrap().catch(_error);
          };

          const user = findUser(req.phone_number);
          const project = [
            Translate("leaveRequest", language),
            Translate(req.type, language),
          ];
          const leaveTime = {
            startDate: req.date_leave_from.replaceAll("-", "/"),
            endDate: req.date_leave_to?.replaceAll("-", "/"),
            startTime: timeFormat(req.time_leave_from),
            endTime: timeFormat(req.time_leave_to),
          };

          return (
            <Message
              time={req.create_time}
              msg={req.msg}
              status={req.status}
              name={getName()}
              project={project}
              leaveTime={leaveTime}
              typeRequest={"userRequest"}
              handelStatus={handelStatus}
            />
          );
        }
        // msg request
        else if (req.from !== undefined) {
          const getUserPhoneToShowName = () => {
            return type === "boss"
              ? req.from === phoneNumber
                ? req.to
                : req.from
              : req.from;
          };
          const getName = () => {
            return user
              ? `${user.first_name} ${user.last_name} ${
                  user.phone_number === phoneNumber
                    ? "(ME)"
                    : type !== "boss"
                    ? "(MANAGER)"
                    : ""
                }`
              : req.project !== null
              ? `${Translate("group", language)} ${req.project}`
              : Translate("all", language);
          };
          const getTypeRequest = () => {
            return `${
              type === "boss"
                ? req.from === phoneNumber
                  ? "boss"
                  : "user"
                : req.from === phoneNumber
                ? "user"
                : "boss"
            }Request`;
          };
          const handelStatus = (status) => {
            type === "boss"
              ? dispatch(changeStatusMsg({ id: req.id, status }))
                  .unwrap()
                  .then((res) => {
                    dispatch(
                      sendNotification({
                        msg: Translate(
                          status === "accept"
                            ? "RequestAccepted"
                            : "RequestRejected",
                          language
                        ),
                        typeNotification: "REQUEST_ANSWER",
                        to: req.from,
                        id_data: res.id,
                        request: "msg",
                      })
                    );
                  })
                  .catch(_error)
              : dispatch(deleteMsg(req.id)).unwrap().catch(_error);
          };

          const user = findUser(getUserPhoneToShowName());
          const project = [
            req.project ? req.project : Translate("all", language),
          ];

          return (
            <Message
              time={req.create_time}
              msg={req.msg}
              status={req.status}
              name={getName()}
              project={project}
              typeRequest={getTypeRequest()}
              handelStatus={handelStatus}
            />
          );
        }
        // log_task
        else {
          const getName = () => {
            return user ? `${user.first_name} ${user.last_name}` : undefined;
          };
          const getLogTask = () => {
            return type === "boss"
              ? req.project_name === "entry"
                ? I18nManager.isRTL
                  ? `${Translate("forceExit", language)} ${getName()}`
                  : `${getName()} ${Translate("forceExit", language)}`
                : I18nManager.isRTL
                ? `پروژه ${req.project_name} برای ${getName()} متوقف شد.`
                : `${req.project_name} task stopped for ${getName()}`
              : req.project_name === "entry"
              ? `${Translate("exitByAdmin", language)}`
              : `${Translate("task", language)} ${req.project_name} ${Translate(
                  "stoppedByAdmin",
                  language
                )}`;
          };

          const user = findUser(req.phone_number);

          return <div className="bubble direction">{getLogTask()}</div>;
        }
      };
      const getDateGroup = () => {
        const today = new Date().toISOString().slice(0, 10);
        const date = jMoment(new Date(req.create_time));

        return req.create_time
          ? today === date.toISOString().slice(0, 10)
            ? Translate("today", language)
            : `${Translate(date.format("jMMMM"), language)} ${date.jDate()}`
          : undefined;
      };

      const isDate = dateGroup !== getDateGroup();
      dateGroup = getDateGroup();

      return (
        <Grid container justifyContent="center" key={i}>
          <Grid container justifyContent="center">
            {isDate && <div className="bubble">{getDateGroup()}</div>}
          </Grid>
          {getRequestList()}
        </Grid>
      );
    };

    let requests = [...msg, ...leaveRequests, ...taskLogList];
    let dateGroup = "";
    requests =
      cartableFilter === "all" ? requests : requests.filter(getFilterUser);

    return requests.length > 0 ? (
      requests.sort(sortByDate).map(mapRequest)
    ) : (
      <div className="cartable-no-msg direction">
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
          msg: Translate("leaveRequest", language),
          typeNotification: "LEAVE_REQUEST",
          id_data: res.id,
        })
      );
    };

    dispatch(addLeaveRequests(args)).unwrap().then(_then).catch(_error);
  };

  const className = {
    msg: `cartable-container-msg ${type === "boss" ? "cartable-mb" : ""}`,
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
    <div className="cartable-container">
      <div className={className.msg}>{getRequests()}</div>
      {type === "boss" ? (
        <FloatingButton Icon={NotesIcon} onClick={openModalTaskRequest} />
      ) : (
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
      )}
      <MsgModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        toBoss={type !== "boss"}
      />
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
    </div>
  );
};

export default TabCartable;
