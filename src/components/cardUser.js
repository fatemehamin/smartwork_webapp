import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as PersonDelete } from "../assets/icons/person_delete.svg";
import { ReactComponent as Avatar } from "../assets/icons/avatar.svg";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { animated, useSpring } from "@react-spring/web";
import { deleteUsers } from "../features/users/action";
import { endTime, exit } from "../features/tasks/action";
import { updateNowActiveProject } from "../features/users/usersSlice";
import { sendNotification } from "../features/notification/action";
import Alert from "./alert";
import "./cardUser.css";
import {
  setCartableFilter,
  setManagerActiveTab,
} from "../features/config/configSlice";
import {
  Settings,
  MoreHorizOutlined,
  ErrorOutlineRounded,
  Cancel,
  DoDisturb,
} from "@mui/icons-material";

const CardUser = ({
  id,
  firstName,
  lastName,
  phoneNumber,
  nowActiveProject,
  languageUser,
}) => {
  const { language } = useSelector((state) => state.i18n);
  const { userInfo } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.users);

  const [isPressMore, setIsPressMore] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState("");

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const moreRef = useRef();

  const name = `${firstName} ${lastName}`;
  const isBoss = userInfo.phoneNumber === phoneNumber;
  const isNothing = nowActiveProject === "nothing";

  useEffect(() => {
    const handelCloseMore = (e) => {
      // I put moreRef in ref main div so (moreRef.current.contains(e.target) return true if e.target is inside of moreRef)
      !moreRef.current.contains(e.target) && setIsPressMore(false);
    };
    document.addEventListener("mousedown", handelCloseMore);
    return () => document.removeEventListener("mousedown", handelCloseMore);
  }, []);

  const openAlertRemove = () => setOpenAlert(true);
  const toggleMoreIcon = () => setIsPressMore((isMore) => !isMore);

  const navigateStatusMember = () => navigate(`/statusMember/${id}`);

  const navigateCartable = () => {
    dispatch(setManagerActiveTab("cartable"));
    dispatch(setCartableFilter(phoneNumber));
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
      const msg =
        nowActiveProject === "entry"
          ? `${Translate("exitByAdmin", languageUser)}`
          : `${Translate("task", languageUser)} ${nowActiveProject} ${Translate(
              "stoppedByAdmin",
              languageUser
            )}`;

      dispatch(
        updateNowActiveProject({
          phoneNumber,
          nowActiveProject: nowActiveProject !== "entry" ? "entry" : "nothing",
        })
      );

      dispatch(
        sendNotification({
          to: phoneNumber,
          msg,
          typeNotification: "STOP_TASK",
          id_data: res.id,
          lastDurationTask: res.last_duration,
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

  const alert = {
    stopTask: {
      title: "stopTask",
      Icon: () => (
        <DoDisturb color="secondary" className="card-user-icon-stop-task" />
      ),
      ButtonAction: [
        { text: "ok", onClick: handelStopTask, isLoading },
        { text: "cancel", type: "SECONDARY" },
      ],
    },
    deleteUser: {
      title: "deleteUser",
      description: "deleteUserDescription",
      Icon: PersonDelete,
      ButtonAction: [
        { text: "continue", onClick: handleRemoveUser, isLoading },
        { text: "cancel", type: "SECONDARY" },
      ],
    },
  };

  const handleAlertRemove = () => {
    if (!isBoss) {
      openAlertRemove();
      setAlertType("deleteUser");
    }
  };

  const handleAlertStopTask = () => {
    if (!isNothing) {
      setAlertType("stopTask");
      openAlertRemove();
    }
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

  const className = {
    nowActiveProject: `card-user-text${isNothing ? "" : "-active"}`,
    moreTask:
      "card-user-option card-user-pointer display-flex-center direction",
    stopTaskText: `card-user-icon-text ${
      isNothing ? "card-user-icon-text-disable" : ""
    }`,
    removeUser: `card-user-icon-text ${
      isBoss ? "card-user-icon-text-disable" : ""
    }`,
    more: `card-user-icon${isPressMore ? "-more" : ""}`,
  };

  return (
    <animated.div
      className="card-user"
      ref={moreRef}
      style={animationStyle.heightContainer}
    >
      <Avatar className="card-user-avatar" />
      <div className="card-user-name">{name}</div>
      <div className="card-user-option card-user-active">
        <span className={className.nowActiveProject}>
          {isNothing ? Translate("nothing", language) : nowActiveProject}
        </span>
      </div>
      <div className="display-flex-center">
        <Settings className="card-user-icon" onClick={navigateStatusMember} />
        <ErrorOutlineRounded
          className="card-user-icon"
          onClick={navigateCartable}
        />
        <MoreHorizOutlined
          className={className.more}
          onClick={toggleMoreIcon}
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
          <DoDisturb color={isNothing ? "primary50" : "primary"} />
          <span className={className.stopTaskText}>
            {Translate("stopTask", language)}
          </span>
        </animated.div>
        <animated.div
          className={className.moreTask}
          onClick={handleAlertRemove}
          style={animationStyle.displayItemRemove}
        >
          <Cancel color={isBoss ? "primary50" : "primary"} />
          <span className={className.removeUser}>
            {Translate("remove", language)}
          </span>
        </animated.div>
      </animated.div>
      <Alert open={openAlert} setOpen={setOpenAlert} {...alert[alertType]} />
    </animated.div>
  );
};

export default CardUser;
