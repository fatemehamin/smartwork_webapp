import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import personDelete from "../assets/images/person_delete.svg";
import Avatar from "../assets/images/Avatar.svg";
import Alert from "./alert";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { animated, useSpring } from "@react-spring/web";
import { deleteUsers } from "../features/users/action";
import { endTime, exit } from "../features/tasks/action";
import MsgModal from "./msgModal";
import "./cardUser.css";
import {
  SettingsOutlined,
  MoreHorizOutlined,
  ErrorOutlineRounded,
  Cancel,
  DoDisturb,
} from "@mui/icons-material";
import { updateNowActiveProject } from "../features/users/usersSlice";

const CardUser = ({ firstName, lastName, phoneNumber, nowActiveProject }) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { userInfo } = useSelector((state) => state.auth);
  const [isPressMore, setIsPressMore] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
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
    dispatch(
      nowActiveProject !== "entry"
        ? endTime({ name: nowActiveProject, phoneNumber })
        : exit({
            phoneNumber,
            isExitWithBoss: userInfo.phoneNumber !== phoneNumber,
          })
    )
      .unwrap()
      .then((res) => {
        dispatch(
          updateNowActiveProject({
            phoneNumber,
            nowActiveProject:
              nowActiveProject !== "entry" ? "entry" : "nothing",
          })
        );
      })
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
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

  const buttonActionAlert = [
    {
      text: Translate("continue", language),
      onClick: handleRemoveUser,
    },
    { text: Translate("cancel", language), type: "SECONDARY" },
  ];

  const className = {
    nowActiveProject: `card-user-text${
      nowActiveProject === "nothing" ? "" : "-active"
    }`,
    moreTask: `card-user-option display-flex-center ${
      I18nManager.isRTL ? "rtl" : "ltr"
    }`,
    more: `card-user-icon${isPressMore ? "-more" : ""}`,
  };

  const { x } = useSpring({
    from: { x: 0 },
    x: isPressMore ? 1 : 0,
    config: { duration: 400, friction: 80 },
  });

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
            onClick={handelStopTask}
            style={animationStyle.displayItemStopTask}
          >
            <DoDisturb color="primary" />
            <span className="card-user-icon-text">
              {Translate("stopTask", language)}
            </span>
          </animated.div>
          <animated.div
            className={className.moreTask}
            onClick={openAlertRemove}
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
      <Alert
        open={openAlert}
        setOpen={setOpenAlert}
        title={Translate("deleteUser", language)}
        description={Translate("deleteUserDescription", language)}
        Icon={() => <img src={personDelete} alt="Person Delete" />}
        ButtonAction={buttonActionAlert}
      />
    </>
  );
};

export default CardUser;
