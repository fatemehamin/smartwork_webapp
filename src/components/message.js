import React, { useState } from "react";
import { ReactComponent as MiniLogoIcon } from "../assets/icons/mini_logo.svg";
import { ReactComponent as AcceptIcon } from "../assets/icons/accept.svg";
import { ReactComponent as RejectIcon } from "../assets/icons/reject.svg";
import { ReactComponent as AcceptMsgIcon } from "../assets/icons/accept_msg.svg";
import { ReactComponent as RejectMsgIcon } from "../assets/icons/reject_msg.svg";
import { useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { Grid } from "@mui/material";
import moment from "moment";
import Alert from "./alert";
import "./message.css";

const Message = ({
  msg,
  name,
  time,
  project,
  typeRequest,
  status,
  handelStatus,
  leaveTime,
}) => {
  const { I18nManager, language } = useSelector((state) => state.i18n);
  const { type } = useSelector((state) => state.auth);
  const { isLoading } = useSelector((state) => state.leaveRequest);

  const [isAlert, setIsAlert] = useState(false);
  const [alertType, setAlertType] = useState("accept");

  const pad = (n) => (n < 10 ? "0" + n : n);
  const Time = pad(moment(time).hours()) + ":" + pad(moment(time).minutes());
  const openAlert = () => setIsAlert(true);

  const alert = {
    accept: {
      Icon: AcceptMsgIcon,
      title: "acceptRequestUser",
      description: "acceptRequestUserDescription",
      ButtonAction: [
        { text: "yes", onClick: () => handelStatus("accept"), isLoading },
        { text: "no", type: "SECONDARY" },
      ],
    },
    reject: {
      Icon: RejectMsgIcon,
      title: "rejectRequestUser",
      description: "rejectRequestUserDescription",
      ButtonAction: [
        { text: "yes", onClick: () => handelStatus("reject"), isLoading },
        { text: "no", type: "SECONDARY" },
      ],
    },
  };

  const ActionBtn = () => {
    const handleReject = () => {
      if (status === null) {
        openAlert();
        setAlertType("reject");
      }
    };
    const handleAccept = () => {
      if (status === null) {
        openAlert();
        setAlertType("accept");
      }
    };

    return (
      typeRequest === "userRequest" &&
      (type === "boss" ? (
        <Grid item xs={3.5} className="msg-action direction">
          {status !== null && (
            <div className={className.actionText}>
              {Translate(status, language)}
            </div>
          )}
          {status !== "reject" && (
            <AcceptIcon
              className={className.actionIcon}
              onClick={handleAccept}
            />
          )}
          {status !== "accept" && (
            <RejectIcon
              className={className.actionIcon}
              onClick={handleReject}
            />
          )}
        </Grid>
      ) : (
        <Grid item xs={3.5} className="msg-action direction">
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
              onClick={handleReject}
            />
          )}
        </Grid>
      ))
    );
  };

  const className = {
    time: `msg-time text-${I18nManager.isRTL ? "left" : "right"}`,
    actionText: `msg-action-text msg-action-${status}`,
    actionIcon: `msg-action-icon msg-action-${status}`,
  };

  return (
    <Grid container className="msg-container direction">
      <Grid item xs={1} mt={1}>
        <MiniLogoIcon />
      </Grid>
      <Grid item xs={8} className="msg-name text-align">
        {name}
      </Grid>
      <Grid item xs={3} className={className.time}>
        {Time}
      </Grid>
      <Grid container item xs={8.5}>
        {project.map((p, i) => (
          <div className="msg-project" key={i}>
            {p}
          </div>
        ))}
      </Grid>
      <ActionBtn />
      {leaveTime !== undefined && (
        <Grid container alignItems="center">
          <div className="msg-date msg-date-text">
            {leaveTime.endDate ? leaveTime.startDate : leaveTime.startTime}
          </div>
          <div>{Translate("to", language)}</div>
          <div className="msg-date msg-date-text">
            {leaveTime.endDate ? leaveTime.endDate : leaveTime.endTime}
          </div>
          {leaveTime.endDate === undefined && (
            <div className="msg-date-text">{leaveTime.startDate}</div>
          )}
        </Grid>
      )}
      <Grid container className="msg-text direction">
        {msg}
      </Grid>
      <Alert open={isAlert} setOpen={setIsAlert} {...alert[alertType]} />
    </Grid>
  );
};

export default Message;
