import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { endTime, startTime } from "../features/tasks/action";
import { useSnackbar } from "react-simple-snackbar";
import { animated, useSpring } from "@react-spring/web";
import { Translate } from "@mui/icons-material";
import "./task.css";

const Task = ({
  name,
  currentTask,
  initialDuration,
  lastEntry,
  setOpenAlert,
  setAlertType,
}) => {
  const dispatch = useDispatch();
  const [isEnable, setIsEnable] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
  const [openSnackbar] = useSnackbar();
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { language } = useSelector((state) => state.i18n);
  const [backgroundPosition, api] = useSpring(() => ({
    backgroundPositionX: "0px",
    backgroundPositionY: "140px",
  }));
  // const { animation } = useSpring({ from: { x: 0 }, x: 1 });

  const FullWidth = () =>
    api.start({
      from: { backgroundPositionX: "0px", backgroundPositionY: "140px" },
      to: { backgroundPositionX: "300px", backgroundPositionY: "-25px" },
    });

  const emptyWidth = () =>
    api.start({
      from: { backgroundPositionX: "300px", backgroundPositionY: "-25px" },
      to: { backgroundPositionX: "0px", backgroundPositionY: "140px" },
    });

  // const firstIndicatorRotate = () => ({
  //   transform: animation.to({
  //     range: [0, 50],
  //     output: ["0deg", "180deg"],
  //   }),
  //   // .to((x) => `scale(${x}) rotate(4deg)`),
  // });

  //     };
  //     const SecondIndicatorRotate = {
  //       transform: [
  //         {
  //           rotate: animation.interpolate({
  //             inputRange: [0, 100],
  //             outputRange: ["0deg", "360deg"],
  //             extrapolate: "clamp",
  //           }),
  //         },
  //       ],
  //     };
  //     const SecondIndicatorVisible = {
  //       opacity: animation.interpolate({
  //         inputRange: [0, 49, 50, 100],
  //         outputRange: [0, 0, 1, 1],
  //       }),
  //     };

  //   // animation
  //   const [progress, setProgress] = useState(0);
  //   const [startLoading, setStartLoading] = useState(false);
  //   const animation = useRef(new Animated.Value(0)).current;
  //   const animateProgress = useRef((toValue) => {
  //     Animated.spring(animation, {
  //       toValue,
  //       useNativeDriver: true,
  //     }).start();
  //   }).current;
  //   const firstIndicatorRotate = {
  //     transform: [
  //       {
  //         rotate: animation.interpolate({
  //           inputRange: [0, 50],
  //           outputRange: ["0deg", "180deg"],
  //           extrapolate: "clamp",
  //         }),
  //       },
  //     ],
  //   };
  //   const SecondIndicatorRotate = {
  //     transform: [
  //       {
  //         rotate: animation.interpolate({
  //           inputRange: [0, 100],
  //           outputRange: ["0deg", "360deg"],
  //           extrapolate: "clamp",
  //         }),
  //       },
  //     ],
  //   };
  //   const SecondIndicatorVisible = {
  //     opacity: animation.interpolate({
  //       inputRange: [0, 49, 50, 100],
  //       outputRange: [0, 0, 1, 1],
  //     }),
  //   };
  useEffect(() => {
    (name !== currentTask.name || currentTask.start === 0) &&
      setIsEnable(false);
    currentTask.start !== 0 && name === currentTask.name && setIsEnable(true);
    if (isEnable) {
      const id = setInterval(() => {
        setDuration(
          () => new Date().getTime() - currentTask.start + initialDuration
        );
      }, 1000);
      return () => clearInterval(id);
    }
    //   animateProgress(progress);
    //   if (startLoading && progress <= 100) {
    //     const intervalId = setInterval(() => {
    //       setProgress(() => progress + 100);
    //     }, 500);
    //     return () => clearInterval(intervalId);
    //   }
    //   setProgress(0);
    //   setStartLoading(false);
  }, [
    currentTask,
    isEnable,
    // duration,
    // progress,
    //  startLoading
  ]);
  console.log(backgroundPosition);
  const Timer = ({ time }) => {
    let duration = moment.duration(time);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      <p
        // numberOfLines={1}
        className={`task_time text_${isEnable ? "ENABLE" : "DISABLE"}`}
      >
        {pad(duration.hours())}:{pad(duration.minutes())}:
        {pad(duration.seconds())}
      </p>
    );
  };

  const onClickHandler = () => {
    const entryFirstHandler = () => {
      setOpenAlert(true);
      setAlertType("entryFirst");
    };
    const test1 = () => {
      FullWidth();
      dispatch(startTime(name))
        .unwrap()
        .catch((error) => {
          openSnackbar(
            error.code === "ERR_NETWORK"
              ? Translate("connectionFailed", language)
              : error.message
          );
        });
    };
    const test2 = () => {
      FullWidth();
      dispatch(startTime(name));
    };
    const test3 = () => {
      emptyWidth();
      dispatch(endTime({ name, phoneNumber }));
    };
    // برای زمانی که روی خود تسک دوباره کلیک می کنی تا غیر فعال و یا دوباره فعال بشود
    currentTask.name === name
      ? (currentTask.start ? test3() : test2()).unwrap().catch((error) => {
          openSnackbar(
            error.code === "ERR_NETWORK"
              ? Translate("connectionFailed", language)
              : error.message
          );
        })
      : // برای زمانی که از تسکی به تسک دیگه پرس می کنیم
      currentTask.start
      ? dispatch(endTime({ name: currentTask.name, phoneNumber }))
          .unwrap()
          .then(() => {
            dispatch(startTime(name))
              .unwrap()
              .catch((error) => {
                openSnackbar(
                  error.code === "ERR_NETWORK"
                    ? Translate("connectionFailed", language)
                    : error.message
                );
              });
          })
      : lastEntry
      ? test1()
      : entryFirstHandler();
  };

  return (
    <div
      onClick={onClickHandler}
      //   onPressIn={() => setStartLoading(true)}
      //   onPressOut={() => setStartLoading(false)}
      //   onLongPress={() => {
      //     onPressHandler();
      //     Vibration.vibrate(40);
      //   }}
      //   delayLongPress={550}
    >
      <animated.div
        style={backgroundPosition}
        className="circleBase"
        //   style={ { transform: [{ rotate: "-45deg" }] }}
      >
        {/* <Animated.View
          style={[styles.circleBase, styles.indicator, firstIndicatorRotate]}
        /> */}
        {/* <View style={[styles.circleBase, styles.coverIndicator]} /> */}
        {/* <Animated.View
          style={[
            styles.circleBase,
            styles.indicator,
            SecondIndicatorRotate,
            SecondIndicatorVisible,
          ]}
        ></Animated.View> */}
        <div className={`task container_${isEnable ? "ENABLE" : "DISABLE"}`}>
          <Timer time={duration} />
          <p className={`task_text text_${isEnable ? "ENABLE" : "DISABLE"}`}>
            {name}
          </p>
        </div>
      </animated.div>
    </div>
  );
};

//   container: {
//     width: 150,
//     height: 150,
//     borderRadius: 150 / 2,
//     justifyContent: 'center',
//     alignItems: 'center',
//     transform: [{rotate: '45deg'}],
//   },
//   indicator: {
//     borderTopColor: '#176085',
//     borderLeftColor: '#176085',
//     borderBottomColor: 'transparent',
//     borderRightColor: 'transparent',
//     borderWidth: 5,
//     position: 'absolute',
//   },
//   coverIndicator: {
//     borderTopColor: '#f5f5f5',
//     borderLeftColor: '#f5f5f5',
//     borderBottomColor: 'transparent',
//     borderRightColor: 'transparent',
//     borderWidth: 5,
//     position: 'absolute',
//     // transform: [{rotate: '45deg'}],
//   },
export default Task;
