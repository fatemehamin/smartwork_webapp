import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import personDelete from "../assets/images/person_delete.svg";
import Avatar from "../assets/images/Avatar.svg";
import { Collapse } from "@mui/material";
import Input from "./input";
import Button from "./button";
import Alert from "./alert";
import { Translate } from "../features/i18n/translate";
import Modal from "./modal";
import { useSnackbar } from "react-simple-snackbar";
import { animated, useSpring } from "@react-spring/web";
import { deleteUsers } from "../features/users/action";
import "./cardUser.css";
import {
  SettingsOutlined,
  MoreHorizOutlined,
  ErrorOutlineRounded,
  Cancel,
  DoDisturb,
  ExpandLess,
  ChevronRightOutlined,
  ChevronLeftOutlined,
} from "@mui/icons-material";
// import { endTime } from "../redux/action/employeeAction";

const CardUser = ({ firstName, lastName, phoneNumber, nowActiveProject }) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const [isPressMore, setIsPressMore] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notifExplain, setNotifExplain] = useState("");
  const [notifProject, setNotifProject] = useState("");
  const [isCollapse, setIsCollapse] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const moreRef = useRef();

  useEffect(() => {
    const handelCloseMore = (e) => {
      // I put moreRef in ref main div so (moreRef.current.contains(e.target) return true if e.target is inside of moreRef)
      !moreRef.current.contains(e.target) && setIsPressMore(false);
    };
    document.addEventListener("mousedown", handelCloseMore);
    return () => document.removeEventListener("mousedown", handelCloseMore);
  }, []);

  const handelClickSettingIcon = () => navigate(`/statusMember/${phoneNumber}`);

  const handleToggleNotifModal = () => {
    setNotifModalVisible((visible) => !visible);
    setIsCollapse(false);
    setIsPressMore(false);
  };

  const handleToggleCollapse = () => setIsCollapse(!isCollapse);

  const handleSelectNotifProject = (nameProject) => {
    setNotifProject(nameProject);
    setIsCollapse(false);
  };

  const handelToggleAlertSendMessage = () => {
    const canSend = notifExplain.trim() && notifProject;
    if (!canSend) {
      openSnackbar(Translate("errorSendNotif", language));
    } else {
      handleToggleNotifModal();
      setOpenAlert(true);
      setAlertType("sendMessage");
    }
  };

  const handelSendMessage = () => {}; // ----------------------------- not Complete -------------------

  const handelClickMoreIcon = () => setIsPressMore((isMore) => !isMore);

  const handelClickStopTask = () => {
    const nowTime = new Date().getTime();
    // dispatch(
    //   endTime(nowActiveProject, nowTime, undefined, setIsPress, phoneNumber)
    // );
  }; // ----------------------------- not Complete -------------------

  const handelToggleAlertRemove = () => {
    setOpenAlert(true);
    setAlertType("delete");
  };

  const handleRemoveUser = () => {
    dispatch(deleteUsers(phoneNumber))
      .unwrap()
      .catch((error) =>
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message.slice(-3) === "403"
            ? Translate("canNotRemoveَAdmin", language)
            : error.message
        )
      );
  };

  const alert = {
    delete: {
      title: Translate("deleteUser", language),
      description: Translate("deleteUserDescription", language),
      Icon: () => <img src={personDelete} width={60} alt="Person Delete" />,
      ButtonAction: [
        {
          text: Translate("continue", language),
          onClick: handleRemoveUser,
        },
        { text: Translate("cancel", language), type: "SECONDARY" },
      ],
    },
    sendMessage: {
      title: Translate("sendMessage", language),
      description: "",
      Icon: () => <img src={personDelete} width={60} alt="Person Delete" />, //----------------------------- not Complete -------------------
      ButtonAction: [
        {
          text: Translate("continue", language),
          onClick: handelSendMessage,
        },
        { text: Translate("cancel", language), type: "SECONDARY" },
      ],
    },
  };

  const { x } = useSpring({
    from: { x: 0 },
    x: isPressMore ? 1 : 0,
    config: { duration: 400, friction: 80 },
  });

  const listEmployeeProjects = useSelector((state) =>
    state.users.users.find((e) => e.phone_number === phoneNumber)
  ).project_list?.map((p) => (
    <div
      className="card-user-notif-project"
      onClick={() => handleSelectNotifProject(p.project_name)}
    >
      {p.project_name}
    </div>
  ));

  const className = {
    nowActiveProject: `card-user-text${
      nowActiveProject === "nothing" ? "" : "-active"
    }`,
    moreTask: `card-user-option display-flex-center ${
      I18nManager.isRTL ? "rtl" : "ltr"
    }`,
    collapseBtn: `card-user-btn-collapse ${
      isCollapse ? "card-user-border-top" : ""
    } ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    collapseBtnText: `card-user-btn-collapse-title${isCollapse ? "-open" : ""}`,
    containerBtn: `container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    more: `card-user-icon${isPressMore ? "-more" : ""}`,
  };

  const animationStyle = {
    heightContainer: {
      height: x.to({
        range: [0, 1],
        output: [205, 300],
      }),
    },
    displayMore: {
      overflow: isPressMore ? "visible" : "hidden",
      height: x.to({
        range: [0, 1],
        output: [0, 90],
      }),
    },
    displayItemStopTask: {
      opacity: x.to({
        range: [0, 0.25, 0.75, 1],
        output: [0, 0, 0.5, 1],
      }),
    },
    displayItemRemove: {
      opacity: x.to({
        range: [0, 0.25, 0.75, 0.8, 0.9, 1],
        output: [0, 0, 0, 0.1, 0.5, 1],
      }),
    },
  };

  return (
    <>
      <animated.div
        className="card-user"
        ref={moreRef}
        style={animationStyle.heightContainer}
      >
        <img src={Avatar} className="card-user-avatar" alt="Avatar" />
        <div className="card-user-name">{`${firstName} ${lastName}`}</div>
        <div className="card-user-option card-user-active">
          <span className={className.nowActiveProject}>
            {nowActiveProject === "nothing"
              ? Translate("nothing", language)
              : nowActiveProject}
          </span>
        </div>
        <div className="display-flex-center">
          <SettingsOutlined
            className="card-user-icon"
            onClick={handelClickSettingIcon}
          />
          <ErrorOutlineRounded
            className="card-user-icon"
            onClick={handleToggleNotifModal}
          />
          <MoreHorizOutlined
            className={className.more}
            onClick={handelClickMoreIcon}
          />
        </div>
        <animated.div
          style={animationStyle.displayMore}
          className="card-user-option-container"
        >
          <animated.div
            className={className.moreTask}
            onClick={handelClickStopTask}
            style={animationStyle.displayItemStopTask}
          >
            <DoDisturb color="primary" />
            <span className="card-user-icon-text">
              {Translate("stopTask", language)}
            </span>
          </animated.div>
          <animated.div
            className={className.moreTask}
            onClick={handelToggleAlertRemove}
            style={animationStyle.displayItemRemove}
          >
            <Cancel color="primary" />
            <span className="card-user-icon-text">
              {Translate("remove", language)}
            </span>
          </animated.div>
        </animated.div>
      </animated.div>
      <Modal
        modalVisible={notifModalVisible}
        setModalVisible={setNotifModalVisible}
      >
        <h2 className="text-center">{Translate("notification", language)}</h2>
        <div className="card-user-select-project">
          <Collapse in={isCollapse}>{listEmployeeProjects}</Collapse>
          <div className={className.collapseBtn} onClick={handleToggleCollapse}>
            <span className={className.collapseBtnText}>
              {notifProject ? notifProject : Translate("project", language)}
            </span>
            {isCollapse ? (
              <ExpandLess />
            ) : I18nManager.isRTL ? (
              <ChevronLeftOutlined />
            ) : (
              <ChevronRightOutlined />
            )}
          </div>
        </div>
        <Input
          value={notifExplain}
          setValue={setNotifExplain}
          placeholder={Translate("explain", language)}
          multiline
        />
        <div className={className.containerBtn}>
          <Button
            label={Translate("send", language)}
            customStyle={{ width: "40%" }}
            onClick={handelToggleAlertSendMessage}
          />
          <Button
            label={Translate("cancel", language)}
            customStyle={{ width: "40%" }}
            onClick={handleToggleNotifModal}
            type="SECONDARY"
          />
        </div>
      </Modal>
      <Alert {...alert[alertType]} open={openAlert} setOpen={setOpenAlert} />
    </>
  );
};

export default CardUser;
