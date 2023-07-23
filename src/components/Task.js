import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { endTime, startTime } from "../features/tasks/action";
import { useSnackbar } from "react-simple-snackbar";
import { animated, useSpring } from "@react-spring/web";
import moment from "moment";
import "./task.css";
import { Translate } from "../features/i18n/translate";

const Task = ({
  name,
  currentTask,
  initialDuration,
  lastEntry,
  setOpenAlert,
  setIsEnd,
  isEmpty,
  isEnable,
}) => {
  const dispatch = useDispatch();
  const [duration, setDuration] = useState(initialDuration);
  const [openSnackbar] = useSnackbar();
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { language } = useSelector((state) => state.i18n);
  const [animation, api] = useSpring(() => ({
    backgroundPositionX: isEnable ? "300px" : "0px",
    backgroundPositionY: isEnable ? "-25px" : "140px",
    color: isEnable
      ? `rgba(${255},${255},${255},${1})`
      : `rgba(${68},${44},${46},${0.4})`,
    borderColor: isEnable
      ? `rgba(${255},${255},${255},${1})`
      : `rgba(${68},${44},${46},${0.4})`,
    config: { duration: 700 },
  }));

  const fillWidth = () =>
    api.start({
      from: {
        backgroundPositionX: "0px",
        backgroundPositionY: "140px",
        color: `rgba(${68},${44},${46},${0.4})`,
        borderColor: `rgba(${68},${44},${46},${0.4})`,
      },
      to: {
        backgroundPositionX: "300px",
        backgroundPositionY: "-25px",
        color: `rgba(${255},${255},${255},${1})`,
        borderColor: `rgba(${255},${255},${255},${1})`,
      },
    });

  const emptyWidth = () =>
    api.start({
      from: {
        backgroundPositionX: "300px",
        backgroundPositionY: "-25px",
        color: `rgba(${255},${255},${255},${1})`,
        borderColor: `rgba(${255},${255},${255},${1})`,
      },
      to: {
        backgroundPositionX: "0px",
        backgroundPositionY: "140px",
        color: `rgba(${68},${44},${46},${0.4})`,
        borderColor: `rgba(${68},${44},${46},${0.4})`,
      },
    });

  useEffect(() => {
    if (isEmpty) {
      emptyWidth();
      setIsEnd(false);
    }

    if (isEnable) {
      const id = setInterval(() => {
        setDuration(
          () => new Date().getTime() - currentTask.start + initialDuration
        );
      }, 1000);
      return () => clearInterval(id);
    }
  }, [currentTask, isEnable]);

  const Timer = ({ time }) => {
    let duration = moment.duration(time);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      <animated.div className="task_time" style={animation.color}>
        {pad(duration.hours())}:{pad(duration.minutes())}:
        {pad(duration.seconds())}
      </animated.div>
    );
  };

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const onClickHandler = () => {
    const entryFirstHandler = () => setOpenAlert(true);

    const handleStartTask = () => {
      fillWidth();
      dispatch(startTime(name))
        .unwrap()
        .catch((error) => {
          emptyWidth();
          _error(error);
        });
    };

    const handleEndTask = (name, _then) => {
      _then !== undefined ? setIsEnd(true) : emptyWidth();
      dispatch(endTime({ name, phoneNumber }))
        .unwrap()
        .then(_then)
        .catch((error) => {
          fillWidth();
          _error(error);
        });
    };

    currentTask.name === name // برای زمانی که روی خود تسک دوباره کلیک می کنی تا غیر فعال و یا دوباره فعال بشود
      ? currentTask.start
        ? handleEndTask(name)
        : handleStartTask()
      : // برای زمانی که از تسکی به تسک دیگه پرس می کنیم
      currentTask.start
      ? handleEndTask(currentTask.name, handleStartTask)
      : lastEntry // برای زمانی که تازه وارد شدیم
      ? handleStartTask()
      : entryFirstHandler();
  };

  return (
    <div onClick={onClickHandler}>
      <animated.div style={animation} className="circleBase">
        <Timer time={duration} />
        <p className="task_text">{name}</p>
      </animated.div>
    </div>
  );
};

export default Task;
