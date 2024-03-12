import React, { useEffect, useState } from "react";
import AppBar from "../components/appBar";
import Modal from "../components/modal";
import Input from "../components/input";
import CheckBox from "../components/checkBox";
import FloatingButton from "../components/floatingButton";
import Alert from "../components/alert";
import dayjs from "dayjs";
import moment from "moment";
import { Add, PlayArrow, Cancel, ModeEdit } from "@mui/icons-material";
import { Translate } from "../features/i18n/translate";
import { useDispatch, useSelector } from "react-redux";
import { animated, useSpring } from "@react-spring/web";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Collapse } from "@mui/material";
import { ReactComponent as AcceptIcon } from "../assets/icons/accept.svg";
import { ReactComponent as RejectIcon } from "../assets/icons/reject.svg";
import { ReactComponent as RemoveShiftIcon } from "../assets/icons/removeShift.svg";
import { useSnackbar } from "react-simple-snackbar";
import { updateCurrentShift } from "../features/shiftWork/shiftWorkSlice";
import { TbEditCircle } from "react-icons/tb";
import {
  addShiftWork,
  deleteShiftWork,
  fetchShiftWork,
  updateShiftWork,
} from "../features/shiftWork/action";
import "./shiftWork.css";

const ShiftList = ({ onClickEditShift, setIsAlert }) => {
  const { shift } = useSelector((state) => state.shift);
  const { language } = useSelector((state) => state.i18n);

  const dispatch = useDispatch();

  return shift.length > 0 ? (
    shift.map((s, i) => {
      const onClickRemoveShift = () => {
        dispatch(updateCurrentShift(s));
        setIsAlert(true);
      };

      return (
        <div key={i} className="SW-item direction">
          <p>{s.name}</p>
          <div className="SW-item-edit-btn">
            <ModeEdit sx={{ p: 1 }} onClick={() => onClickEditShift(s)} />
            <Cancel sx={{ p: 1 }} onClick={onClickRemoveShift} />
          </div>
        </div>
      );
    })
  ) : (
    <p className="direction">{Translate("noWorkShift", language)}</p>
  );
};

const ShiftWork = () => {
  const initShiftDay = {
    allowed_delay: null,
    delay_compensation: null,
    overtime_before_starting_work: null,
    overtime: null,
    day: "Saturday",
    end_time: 1700919000000,
    start_time: 1700886600000,
    holiday: false,
    remote: false,
    id: null,
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isEditDay, setIsEditDay] = useState(false);
  const [name, setName] = useState("");
  const [isOvertimeOnHolidays, setIsOvertimeOnHolidays] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [shiftDay, setShiftDay] = useState(initShiftDay);
  const [lengthShift, setLengthShift] = useState("--:--");

  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { currentShift, isLoading, weeksOfDays } = useSelector(
    (state) => state.shift
  );

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShiftWork());
  }, []);

  useEffect(() => {
    calculateLengthShift();
  }, [shiftDay]);

  const { animationCollapsed } = useSpring({
    animationCollapsed: collapsed ? 1 : 0,
    config: { duration: 300, friction: 80 },
  });

  const styleAnimation = {
    rotateCollapse: {
      transform: animationCollapsed.to({
        range: [0, 1],
        output: [
          I18nManager.isRTL ? "rotate(180deg)" : "rotate(0deg)",
          "rotate(90deg)",
        ],
      }),
    },
  };

  const closeModal = (res) => setModalVisible(false);

  const updateShiftDayInCurrentShift = (newDay) => {
    dispatch(
      updateCurrentShift({
        ...currentShift,
        shiftDay: currentShift.shiftDay.map((shift, index) =>
          index === activeDayIndex ? newDay : shift
        ),
      })
    );
    setIsEditDay(false);
  };

  const toggleIsEditDay = () => setIsEditDay((value) => !value);

  const toggleCollapse = () => setCollapsed((value) => !value);

  const toggleOverTimeOnHolidays = () => setIsOvertimeOnHolidays((i) => !i);

  const toggleHoliday = (e) => {
    const newDay = { ...shiftDay, holiday: e.target.checked, remote: false };
    setShiftDay(newDay);
    updateShiftDayInCurrentShift(newDay);
  };

  const toggleRemote = (e) => {
    const newDay = { ...shiftDay, remote: e.target.checked };
    setShiftDay(newDay);
    updateShiftDayInCurrentShift(newDay);
  };

  const toggleAllowDelay = (e) => {
    const newDay = {
      ...shiftDay,
      allowed_delay: e.target.checked ? "7200" : null, //default 2 hours
    };
    setShiftDay(newDay);
  };

  const toggleDelayCompensation = (e) => {
    const newDay = {
      ...shiftDay,
      delay_compensation: e.target.checked ? "7200" : null, //default 2 hours
    };
    setShiftDay(newDay);
  };

  const toggleOvertime = (e) => {
    const newDay = {
      ...shiftDay,
      overtime: e.target.checked ? "7200" : null, //default 2 hours
    };
    setShiftDay(newDay);
  };

  const toggleBeforeOvertime = (e) => {
    const newDay = {
      ...shiftDay,
      overtime_before_starting_work: e.target.checked ? "7200" : null, //default 2 hours
    };
    setShiftDay(newDay);
  };

  const onClickEditShift = (s) => {
    dispatch(updateCurrentShift(s));
    setName(s.name);
    setIsOvertimeOnHolidays(s.over_time_holiday);
    setActiveDayIndex(0);
    setShiftDay(s.shiftDay[0]);
    setModalVisible(true);
    setIsEdit(true);
    setIsEditDay(false);
    collapsed && toggleCollapse();
  };

  const onClickDays = (index) => {
    setActiveDayIndex(index);
    setShiftDay(currentShift.shiftDay[index]);
    setIsEditDay(false);
  };

  const onClickFTB = () => {
    const args = {
      id: null,
      name: "",
      over_time_holiday: false,
      shiftDay: weeksOfDays.map((item) => ({ ...initShiftDay, day: item })),
    };

    dispatch(updateCurrentShift(args));
    setActiveDayIndex(0);
    setShiftDay(initShiftDay);
    setName("");
    setIsOvertimeOnHolidays(false);
    setModalVisible(true);
    setIsEdit(false);
    setIsEditDay(false);
    collapsed && toggleCollapse();
  };

  const calculateLengthShift = () => {
    const pad = (n) => (n < 10 ? "0" + n : n);
    const length = shiftDay.end_time - shiftDay.start_time;
    const duration = moment.duration(length);
    setLengthShift(
      length < 0
        ? "--:--"
        : pad(duration.hours()) + ":" + pad(duration.minutes())
    );
  };

  const handleAccept = () => updateShiftDayInCurrentShift(shiftDay);

  const handleDeleteShift = () => dispatch(deleteShiftWork(currentShift.id));

  const SendShift = () => {
    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "400"
          ? Translate("shiftNameExist", language)
          : error.message
      );
    };

    const args = {
      id: currentShift.id,
      name,
      over_time_holiday: isOvertimeOnHolidays,
      shift_day: currentShift.shiftDay,
    };

    dispatch(isEdit ? updateShiftWork(args) : addShiftWork(args))
      .unwrap()
      .then(closeModal)
      .catch(_error);
  };

  const TimeBox = ({
    title,
    className,
    timestamp,
    durationInSeconds,
    keyTimeType,
    ...props
  }) => {
    const onChangeTime = (d) => {
      if (durationInSeconds) {
        const newDurationInSeconds = d.$H * 3600 + d.$m * 60;

        const newDay = { ...shiftDay, [keyTimeType]: newDurationInSeconds };
        setShiftDay(newDay);
      } else {
        const newDay = { ...shiftDay, [keyTimeType]: d.$d.getTime() };
        setShiftDay(newDay);
      }
    };

    const defaultValue = durationInSeconds
      ? dayjs().startOf("day").add(durationInSeconds, "seconds")
      : dayjs(new Date(parseInt(timestamp)));

    return (
      <div className={className}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {title !== undefined && (
            <p className="SW-text-title-time">{Translate(title, language)}</p>
          )}
          <TimePicker
            defaultValue={defaultValue}
            ampm={false}
            onChange={onChangeTime}
            {...props}
          />
        </LocalizationProvider>
      </div>
    );
  };

  const propsModal = {
    modalVisible,
    setModalVisible,
    label: "addShift",
    buttonActions: isEditDay
      ? undefined
      : [
          {
            text: "save",
            action: SendShift,
            isLoading,
            disable: name.split()[0] === "",
          },
          { text: "cancel", action: closeModal },
        ],
  };

  const propsAlert = {
    open: isAlert,
    setOpen: setIsAlert,
    title: "removeShift",
    description: "removeShiftDescription",
    Icon: RemoveShiftIcon,
    ButtonAction: [
      { text: "yes", onClick: handleDeleteShift, isLoading },
      { text: "no", type: "SECONDARY" },
    ],
  };

  return (
    <div>
      <AppBar label="shiftWork" />
      <ShiftList onClickEditShift={onClickEditShift} setIsAlert={setIsAlert} />
      <FloatingButton Icon={Add} onClick={onClickFTB} />
      <Modal {...propsModal}>
        <Input
          placeholder={Translate("shiftName", language)}
          value={name}
          setValue={setName}
          autoFocus
        />
        <CheckBox
          name={Translate("overtimeOnHolidays", language)}
          style={{ margin: "0px 16px" }}
          toggle={isOvertimeOnHolidays}
          onChange={toggleOverTimeOnHolidays}
        />

        <div className="SW-tab-days direction">
          {weeksOfDays.map((item, index) => (
            <div
              key={index}
              onClick={() => onClickDays(index)}
              className={`SW-day ${
                index === activeDayIndex && "SW-active-day"
              }`}
            >
              <p className="SW-day-text">{Translate(item, language)}</p>
            </div>
          ))}
        </div>

        <div className={`direction SW-row-model-container`}>
          <CheckBox
            name={Translate("holiday", language)}
            style={{ margin: "0px 16px" }}
            toggle={shiftDay.holiday}
            onChange={toggleHoliday}
          />
          {!shiftDay.holiday && (
            <CheckBox
              name={Translate("remote", language)}
              toggle={shiftDay.remote}
              style={{ margin: "0px 16px" }}
              onChange={toggleRemote}
            />
          )}
        </div>

        {!shiftDay?.holiday &&
          (isEditDay ? (
            <div className="SW-define-container">
              <div className="display-flex-center container_btn_row direction SW-mt10">
                <TimeBox
                  title="startTime"
                  className="SW-fill-box"
                  timestamp={shiftDay.start_time}
                  keyTimeType="start_time"
                />

                <div>
                  <p className="SW-text-title-time">
                    {Translate("shiftLength", language)}
                  </p>
                  <p className="SW-text-title-time">{lengthShift}</p>
                </div>

                <TimeBox
                  title="endTime"
                  timestamp={shiftDay.end_time}
                  keyTimeType="end_time"
                />
              </div>

              <div
                onClick={toggleCollapse}
                className="display-flex-center direction mt10"
              >
                <p className="SW-text">{Translate("advanced", language)}</p>
                <hr className="SW-advance" />
                <animated.div
                  style={styleAnimation.rotateCollapse}
                  className="SW-icon-collapse"
                >
                  <PlayArrow />
                </animated.div>
              </div>

              <Collapse in={collapsed} className="SW-container-collapse">
                <div className="display-flex-center-space direction">
                  <CheckBox
                    name={Translate("allowedDelay", language)}
                    onChange={toggleAllowDelay}
                    toggle={shiftDay.allowed_delay !== null}
                  />
                  <TimeBox
                    disabled={!shiftDay.allowed_delay}
                    keyTimeType="allowed_delay"
                    durationInSeconds={shiftDay.allowed_delay}
                  />
                </div>
                <div className="display-flex-center-space direction">
                  <CheckBox
                    name={Translate("delayCompensation", language)}
                    onChange={toggleDelayCompensation}
                    toggle={shiftDay.delay_compensation !== null}
                  />
                  <TimeBox
                    disabled={!shiftDay.delay_compensation}
                    keyTimeType="delay_compensation"
                    durationInSeconds={shiftDay.delay_compensation}
                  />
                </div>
                <div className="display-flex-center-space direction">
                  <CheckBox
                    name={Translate("isThereOvertime", language)}
                    onChange={toggleOvertime}
                    toggle={shiftDay.overtime !== null}
                  />
                  <TimeBox
                    disabled={!shiftDay.overtime}
                    keyTimeType="overtime"
                    durationInSeconds={shiftDay.overtime}
                  />
                </div>
                <div className="display-flex-center-space  direction">
                  <CheckBox
                    name={Translate("overtimeBeforeStartingWork", language)}
                    onChange={toggleBeforeOvertime}
                    style={{ width: "60%" }}
                    sx={{ width: "100%" }}
                    toggle={shiftDay.overtime_before_starting_work !== null}
                  />
                  <TimeBox
                    disabled={!shiftDay.overtime_before_starting_work}
                    keyTimeType="overtime_before_starting_work"
                    durationInSeconds={shiftDay.overtime_before_starting_work}
                  />
                </div>
              </Collapse>

              <div className="container_btn_row direction SW-btn-container">
                <AcceptIcon className="SW-icon-btn" onClick={handleAccept} />
                <RejectIcon className="SW-icon-btn" onClick={toggleIsEditDay} />
              </div>
            </div>
          ) : (
            <div className="SW-box-time SW-define-container">
              <div className="display-flex-center-space direction">
                <TimeBox
                  title="startTime"
                  timestamp={shiftDay.start_time}
                  disabled
                />

                <div className="SW-box-edit">
                  <TbEditCircle
                    size={30}
                    color="#166085"
                    onClick={toggleIsEditDay}
                    className="SW-icon"
                  />
                  <p className="SW-text-title-time">
                    {Translate("shiftLength", language)}
                  </p>
                  <p className="SW-text-title-time">{lengthShift}</p>
                </div>

                <TimeBox
                  title="endTime"
                  timestamp={shiftDay.end_time}
                  disabled
                />
              </div>
            </div>
          ))}
      </Modal>
      <Alert {...propsAlert} />
    </div>
  );
};

export default ShiftWork;
