// import {View, Text, StyleSheet, Pressable, Alert, Animated} from 'react-native';
import React, { useState, useRef, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import "./employeeBar.css";
// import Icon from 'react-native-vector-icons/FontAwesome';
// import {useNavigation} from '@react-navigation/native';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteEmployee } from "../redux/action/managerAction";
// import {useDrawerStatus} from '@react-navigation/drawer';
import {
  PersonRounded,
  DeleteOutlineRounded,
  SettingsRounded,
} from "@mui/icons-material";
import { animated, useSpring, useTransition } from "@react-spring/web";
import Alert from "./Alert";

const EmployeeBar = ({
  firstName,
  lastName,
  phoneNumber,
  setEmployeeCurrentPhone,
  employeeCurrentPhone,
  nowActiveProject,
  floatingButtonOpen,
}) => {
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [openAlertDelete, setOpenAlertDelete] = useState(false);
  const [springs, api] = useSpring(() => ({
    from: {
      width: isOpen ? "%75" : "100%",
      borderTopRightRadius: isOpen ? 10 : 0,
      borderBottomRightRadius: isOpen ? 10 : 0,
      opacity: isOpen ? 0 : 1,
    },

    // borderTopRightRadius: animation.interpolate({
    //       inputRange: [0, 1],
    //       outputRange: [0, 10],
    //     }),
    //     borderBottomRightRadius: animation.interpolate({
    //       inputRange: [0, 1],
    //       outputRange: [0, 10],
    //     }),
    //   };
    //   const opacityOption = {
    //     opacity: animation,
    //   };
  }));
  const [springs1, api1] = useSpring(() => ({
    from: {
      // width: isOpen ? "25%" : "0%",
      display: isOpen ? "flex" : "none",

      // borderTopRightRadius: isOpen ? 10 : 0,
      // borderBottomRightRadius: isOpen ? 10 : 0,
      // opacity: isOpen ? 0 : 1,
    },

    // borderTopRightRadius: animation.interpolate({
    //       inputRange: [0, 1],
    //       outputRange: [0, 10],
    //     }),
    //     borderBottomRightRadius: animation.interpolate({
    //       inputRange: [0, 1],
    //       outputRange: [0, 10],
    //     }),
    //   };
    //   const opacityOption = {
    //     opacity: animation,
    //   };
  }));
  const toggleOption = () => {
    setEmployeeCurrentPhone(phoneNumber);
    api.start({
      from: springs,
      to: {
        width: isOpen ? "100%" : "%75",
        borderTopRightRadius: isOpen ? 0 : 10,
        borderBottomRightRadius: isOpen ? 0 : 10,
        // opacity: isOpen ? 1 : 0,
      },
    });
    api1.start({
      from: springs1,

      to: {
        // width: isOpen ? "0%" : "%25",
        display: isOpen ? "none" : "flex",
        // borderTopRightRadius: isOpen ? 0 : 10,
        // borderBottomRightRadius: isOpen ? 0 : 10,
        // opacity: isOpen ? 1 : 0,
      },
    });
    setIsOpen(!isOpen);
  };

  const closeOption = () => {
    setIsOpen(false);
    api.start({
      from: { width: "%75" },
      to: { width: "100%" },
    });
  };
  const openOption = () => {
    setIsOpen(true);
    api.start({
      from: { width: "100%" },
      to: { width: "%75" },
    });
  };

  const transition = useTransition(isOpen, {
    from: {
      scale: 0,
      opacity: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
    },
    leave: {
      scale: 0,
      opacity: 0,
    },
  });

  const dispatch = useDispatch();
  //   const DrawerStatus = useDrawerStatus();
  const navigate = useNavigate();
  //   useEffect(() => {
  //     employeeCurrentPhone == phoneNumber ? openOption() : closeOption();
  //     (DrawerStatus == 'open' || floatingButtonOpen) &&
  //       (setEmployeeCurrentPhone(''), closeOption());
  //   }, [employeeCurrentPhone, DrawerStatus, floatingButtonOpen]);
  //   const animation = useRef(new Animated.Value(0)).current;
  //   const toggleOption = () => {
  //     const toValue = isOpen ? 0 : 1;
  //     Animated.spring(animation, {
  //       toValue,
  //       tension: 40,
  //       friction: toValue ? 6 : 25,
  //       useNativeDriver: false,
  //     }).start();
  //     setEmployeeCurrentPhone(phoneNumber);
  //     setIsOpen(!isOpen);
  //   };
  //   const closeOption = () => {
  //     const toValue = 0;
  //     Animated.spring(animation, {
  //       toValue,
  //       tension: 40,
  //       friction: 25,
  //       useNativeDriver: false,
  //     }).start();
  //     setIsOpen(false);
  //   };
  //   const openOption = () => {
  //     const toValue = 1;
  //     Animated.spring(animation, {
  //       toValue,
  //       tension: 40,
  //       friction: 6,
  //       useNativeDriver: false,
  //     }).start();
  //     setIsOpen(true);
  //   };
  //   const barStyle = {
  //     width: animation.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: ['100%', '75%'],
  //     }),
  //     borderTopRightRadius: animation.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [0, 10],
  //     }),
  //     borderBottomRightRadius: animation.interpolate({
  //       inputRange: [0, 1],
  //       outputRange: [0, 10],
  //     }),
  //   };
  //   const opacityOption = {
  //     opacity: animation,
  //   };
  return (
    <div onClick={toggleOption} style={styles.container}>
      <animated.div
        // onClick={toggleOption}
        // style={[styles.employeeDetails, barStyle]}
        style={{
          ...styles.employeeDetails,
          ...springs,
          //  ...barStyle
        }}
      >
        <div style={styles.avatar}>
          <PersonRounded style={styles.avatarIcon} fontSize="large" />
        </div>
        <div style={styles.text}>{`${firstName} ${lastName}`}</div>
        <div
          style={{
            ...styles.nowActiveProject,
            ...(nowActiveProject == "nothing" && { color: "#aaa" }),
          }}
        >
          {nowActiveProject}
        </div>
      </animated.div>
      <animated.div
        // onClick={toggleOption}
        // style={[styles.optionContainer, opacityOption]}
        style={{
          ...styles.optionContainer,
          ...springs1,
          //  ...opacityOption
        }}
      >
        <SettingsRounded
          //  size={25}
          style={styles.optionIcon}
          onClick={() => {
            setEmployeeCurrentPhone(phoneNumber);
            navigate(`/statusMember/${employeeCurrentPhone}`);
            //  navigation.navigate("StatusEmployeeProject", {
            //    employeeCurrentPhone,
            //  });
          }}
        />
        <DeleteOutlineRounded
          // size={25}
          style={styles.optionIcon}
          onClick={() => {
            setOpenAlertDelete(true);
          }}
        />
      </animated.div>
      <Alert
        title="Delete Employee"
        description="Are you sure you want to delete this employee?"
        open={openAlertDelete}
        setOpen={setOpenAlertDelete}
        ButtonAction={[
          { text: "No" },
          {
            text: "Yes",
            onClick: () => {
              setIsOpen(!isOpen);
              dispatch(deleteEmployee(phoneNumber));
            },
          },
        ]}
      />
    </div>
  );
};

const styles = {
  container: {
    // flexDirection: "row",
    display: "flex",
  },
  employeeDetails: {
    height: 80,
    backgroundColor: "#fff",
    display: "flex",
    alignItems: "center",
    // justifyContent: "flex-start",
    // flexDirection: "row",
    // paddingHorizontal: 5,
    paddingLeft: 5,
    paddingRight: 5,
    // boxShadow: "-1px 9px 20px -9px rgba(0,0,0,0.51)",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: "#eee",
  },
  avatar: {
    backgroundColor: "#269dd870",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    display: "flex",
    alignItems: "center",
    marginLeft: 5,
    marginRight: 5,
  },
  avatarIcon: {
    color: "#fff",
    textAlign: "center",
  },
  text: {
    color: "#000",
    fontSize: 16,
    flexGrow: 0.9,
    textAlign: "left",
  },
  nowActiveProject: {
    color: "#d91c5c",
    // textAlign: "left",
  },
  optionContainer: {
    alignItems: "center",
    // justifyContent: "center",
    // display: "flex",
  },
  optionIcon: {
    padding: 10,
    color: "#269dd870",
  },
};

export default EmployeeBar;
