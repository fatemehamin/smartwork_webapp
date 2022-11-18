import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
// import { useDispatch } from "react-redux";
// import { endTime, startTime } from "../redux/action/employeeAction";
import "./Task.css";

export default ({ name, currentTask, initialDuration, lastEntry }) => {
  //   const dispatch = useDispatch();
  const [isEnable, setIsEnable] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
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
    (name != currentTask.name || currentTask.start == 0) && setIsEnable(false);
    currentTask.start != 0 && name == currentTask.name && setIsEnable(true);
    let id;
    if (isEnable) {
      id = setInterval(() => {
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
    // progress,
    //  startLoading
  ]);

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
  //   const onClickHandler = () => {
  //     const nowTime = new Date().getTime();
  //     // برای زمانی که روی خود تسک دوباره کلیک می کنی تا غیر فعال و یا دوباره فعال بشود
  //     currentTask.name == name
  //       ? currentTask.start
  //         ? dispatch(endTime(name, nowTime))
  //         : dispatch(startTime(name, nowTime))
  //       : // برای زمانی که از تسکی به تسک دیگه پرس می کنیم
  //       currentTask.start
  //       ? dispatch(endTime(currentTask.name, nowTime, name))
  //       : lastEntry
  //       ? dispatch(startTime(name, nowTime))
  //       : Alert.alert("ENTRY", "Please entry first and then start the task.");
  //   };
  return (
    <div
    //   onClick={onClickHandler}
    //   onPressIn={() => setStartLoading(true)}
    //   onPressOut={() => setStartLoading(false)}
    //   onLongPress={() => {
    //     onPressHandler();
    //     Vibration.vibrate(40);
    //   }}
    //   delayLongPress={550}
    >
      <div
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
      </div>
    </div>
  );
};
