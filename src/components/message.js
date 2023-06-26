import { Grid } from "@mui/material";
import moment from "moment";
import React from "react";
import { useSelector } from "react-redux";
import MiniLogo from "../assets/images/miniLogo.svg";
import "./message.css";

const Message = ({ msg, name, time, project }) => {
  const { I18nManager } = useSelector((state) => state.i18n);
  const pad = (n) => (n < 10 ? "0" + n : n);
  const Time = pad(moment(time).hours()) + ":" + pad(moment(time).minutes());

  return (
    <Grid
      container
      className={`msg-container ${I18nManager.isRTL ? "rtl" : "ltr"}`}
    >
      <Grid item xs={1}>
        <img src={MiniLogo} className="msg-img" alt="mini logo" />
      </Grid>
      <Grid
        item
        xs={9}
        className={`msg-name text-${I18nManager.isRTL ? "right" : "left"}`}
      >
        {name}
      </Grid>
      <Grid item xs={2} className="msg-time">
        {Time}
      </Grid>
      <Grid item xs={10}>
        <div className="msg-project">{project}</div>
      </Grid>
      <Grid
        container
        className={`msg-text ${I18nManager.isRTL ? "rtl" : "ltr"}`}
      >
        {msg}
      </Grid>
    </Grid>
  );
};

export default Message;
