import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as PersonDelete } from "../assets/images/person_delete.svg";
import { ReactComponent as Avatar } from "../assets/images/Avatar.svg";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { animated, useSpring } from "@react-spring/web";
import { deleteUsers } from "../features/users/action";
import { endTime, exit } from "../features/tasks/action";
import { updateNowActiveProject } from "../features/users/usersSlice";
import MsgModal from "./msgModal";
import Alert from "./alert";
import "./cardUser.css";
import {
  SettingsOutlined,
  MoreHorizOutlined,
  ErrorOutlineRounded,
  Cancel,
  DoDisturb,
} from "@mui/icons-material";

const CardUser = ({ firstName, lastName, phoneNumber, nowActiveProject }) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { userInfo } = useSelector((state) => state.auth);
  const [isPressMore, setIsPressMore] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
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

  const openAlertRemove = () => setOpenAlert(true);
  const handelClickSettingIcon = () => navigate(`/statusMember/${phoneNumber}`);
  const handelClickMoreIcon = () => setIsPressMore((isMore) => !isMore);

  const handleToggleNotifModal = () => {
    setNotifModalVisible((visible) => !visible);
    setIsPressMore(false);
  };

  const handelStopTask = () => {
    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    };

    const _then = (res) => {
      dispatch(
        updateNowActiveProject({
          phoneNumber,
          nowActiveProject: nowActiveProject !== "entry" ? "entry" : "nothing",
        })
      );
    };

    const args =
      nowActiveProject !== "entry"
        ? { phoneNumber, name: nowActiveProject }
        : { phoneNumber, isExitWithBoss: userInfo.phoneNumber !== phoneNumber };

    dispatch(nowActiveProject !== "entry" ? endTime(args) : exit(args))
      .unwrap()
      .then(_then)
      .catch(_error);
  };

  const handleRemoveUser = () => {
    const _error = (error) =>
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "403"
          ? Translate("canNotRemoveَAdmin", language)
          : error.message
      );

    dispatch(deleteUsers(phoneNumber)).unwrap().catch(_error);
  };

  const className = {
    nowActiveProject: `card-user-text${
      nowActiveProject === "nothing" ? "" : "-active"
    }`,
    moreTask: `card-user-option display-flex-center ${
      I18nManager.isRTL ? "rtl" : "ltr"
    }`,
    stopTaskText: `card-user-icon-text ${
      nowActiveProject === "nothing" ? "card-user-icon-text-disable" : ""
    }`,
    more: `card-user-icon${isPressMore ? "-more" : ""}`,
  };

  const { x } = useSpring({
    from: { x: 0 },
    x: isPressMore ? 1 : 0,
    config: { duration: 400, friction: 80 },
  });

  const alert = {
    stopTask: {
      title: Translate("stopTask", language),
      Icon: () => (
        <DoDisturb color="secondary" className="card-user-icon-stop-task" />
      ),
      ButtonAction: [
        { text: Translate("ok", language), onClick: handelStopTask },
      ],
    },
    deleteUser: {
      title: Translate("deleteUser", language),
      description: Translate("deleteUserDescription", language),
      Icon: PersonDelete,
      ButtonAction: [
        {
          text: Translate("continue", language),
          onClick: handleRemoveUser,
        },
        { text: Translate("cancel", language), type: "SECONDARY" },
      ],
    },
  };

  const handleAlertRemove = () => {
    openAlertRemove();
    setAlertType("deleteUser");
  };

  const handleAlertStopTask = () => {
    if (nowActiveProject !== "nothing") {
      setAlertType("stopTask");
      openAlertRemove();
    }
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
        <Avatar className="card-user-avatar" />
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
            onClick={handleAlertStopTask}
            style={animationStyle.displayItemStopTask}
          >
            <DoDisturb
              color={nowActiveProject === "nothing" ? "primary50" : "primary"}
            />
            <span className={className.stopTaskText}>
              {Translate("stopTask", language)}
            </span>
          </animated.div>
          <animated.div
            className={className.moreTask}
            onClick={handleAlertRemove}
            style={animationStyle.displayItemRemove}
          >
            <Cancel color="primary" />
            <span className="card-user-icon-text">
              {Translate("remove", language)}
            </span>
          </animated.div>
        </animated.div>
      </animated.div>
      <MsgModal
        modalVisible={notifModalVisible}
        setModalVisible={setNotifModalVisible}
        userPhoneNumber={phoneNumber}
      />
      <Alert open={openAlert} setOpen={setOpenAlert} {...alert[alertType]} />
    </>
  );
};

export default CardUser;
