import React, { useState } from "react";
import { ReactComponent as MiniLogoIcon } from "../assets/images/miniLogo.svg";
import { ReactComponent as AcceptIcon } from "../assets/images/acceptIcon.svg";
import { ReactComponent as RejectIcon } from "../assets/images/rejectIcon.svg";
import { ReactComponent as AcceptMsgIcon } from "../assets/images/accept_msg_icon.svg";
import { ReactComponent as RejectMsgIcon } from "../assets/images/reject_msg_icon.svg";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus, deleteMsg } from "../features/msg/action";
import { Translate } from "../features/i18n/translate";
import { Grid } from "@mui/material";
import { useSnackbar } from "react-simple-snackbar";
import moment from "moment";
import Alert from "../components/alert";
import "./message.css";

const Message = ({ id, msg, name, time, project, typeRequest, statusMsg }) => {
  const { I18nManager, language } = useSelector((state) => state.i18n);
  const { type } = useSelector((state) => state.auth);
  const [status, setStatus] = useState(statusMsg);
  const [isAlert, setIsAlert] = useState(false);
  const [alertType, setAlertType] = useState("accept");
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const pad = (n) => (n < 10 ? "0" + n : n);
  const Time = pad(moment(time).hours()) + ":" + pad(moment(time).minutes());
  const openAlert = () => setIsAlert(true);

  const handelStatus = (status) => {
    if (type === "boss") {
      dispatch(changeStatus({ id, status }))
        .unwrap()
        .then(() => setStatus(status))
        .catch((error) => {
          openSnackbar(
            error.code === "ERR_NETWORK"
              ? Translate("connectionFailed", language)
              : error.message
          );
        });
    } else {
      dispatch(deleteMsg(id))
        .unwrap()
        .catch((error) => {
          openSnackbar(
            error.code === "ERR_NETWORK"
              ? Translate("connectionFailed", language)
              : error.message
          );
        });
    }
  };

  const alert = {
    accept: {
      Icon: AcceptMsgIcon,
      title: Translate("acceptRequestUser", language),
      description: Translate("acceptRequestUserDescription", language),
      ButtonAction: [
        {
          text: Translate("yes", language),
          onClick: () => handelStatus("accept"),
        },
        { text: Translate("no", language), type: "SECONDARY" },
      ],
    },
    reject: {
      Icon: RejectMsgIcon,
      title: Translate("rejectRequestUser", language),
      description: Translate("rejectRequestUserDescription", language),
      ButtonAction: [
        {
          text: Translate("yes", language),
          onClick: () => handelStatus("reject"),
        },
        { text: Translate("no", language), type: "SECONDARY" },
      ],
    },
  };

  const getActionBtn = () => {
    const handleActionBtn = (type) => {
      if (status === null) {
        openAlert();
        setAlertType(type);
      }
    };
    return (
      typeRequest === "userRequest" &&
      (type === "boss" ? (
        <Grid item xs={3} className={className.action}>
          {status !== null && (
            <div className={className.actionText}>
              {Translate(status, language)}
            </div>
          )}
          {status !== "reject" && (
            <AcceptIcon
              className={className.actionIcon}
              onClick={() => handleActionBtn("accept")}
            />
          )}
          {status !== "accept" && (
            <RejectIcon
              className={className.actionIcon}
              onClick={() => handleActionBtn("reject")}
            />
          )}
        </Grid>
      ) : (
        <Grid item xs={3} className={className.action}>
          {status !== null && (
            <div className={className.actionText}>
              {Translate(status, language)}
            </div>
          )}
          {status === "accept" && (
            <AcceptIcon className={className.actionIcon} />
          )}
          {status !== "accept" && (
            <RejectIcon
              className={className.actionIcon}
              onClick={() => handleActionBtn("reject")}
            />
          )}
        </Grid>
      ))
    );
  };

  const className = {
    container: `msg-container ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    name: `msg-name text-${I18nManager.isRTL ? "right" : "left"}`,
    time: `msg-time text-${I18nManager.isRTL ? "left" : "right"}`,
    action: `msg-action ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    msg: `msg-text ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    actionText: `msg-action-text msg-action-${status}`,
    actionIcon: `msg-action-icon msg-action-${status}`,
  };

  return (
    <Grid container className={className.container}>
      <Grid item xs={1}>
        <MiniLogoIcon />
      </Grid>
      <Grid item xs={8} className={className.name}>
        {name}
      </Grid>
      <Grid item xs={3} className={className.time}>
        {Time}
      </Grid>
      <Grid item xs={9}>
        <div className="msg-project">{project}</div>
      </Grid>
      {getActionBtn()}
      <Grid container className={className.msg}>
        {msg}
      </Grid>
      <Alert open={isAlert} setOpen={setIsAlert} {...alert[alertType]} />
    </Grid>
  );
};

export default Message;
