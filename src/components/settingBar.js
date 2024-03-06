import React from "react";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";
import { Grid } from "@mui/material";
import "./settingBar.css";
import {
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
} from "@mui/icons-material";

const SettingBar = ({
  onClick,
  title,
  info,
  Icon,
  EndAdornment,
  Collapse,
  color = "#176085",
  disabled,
}) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);

  const style = {
    title: {
      color: disabled ? color + "50" : color !== "#176085" ? color : "#176085",
    },
    info: { color: disabled ? "#00000050" : "#00000091" },
    disabledColor: { color: disabled ? color + "50" : color },
  };

  return (
    <Grid container>
      <Grid
        container
        onClick={onClick}
        className="setting-bar-container direction"
      >
        <Grid item xs={2} sm={1} className="display-flex-center">
          <Icon className="icon_bar" style={style.disabledColor} />
        </Grid>

        <Grid item xs={8} sm={10}>
          <p style={style.title} className="text-title text-align">
            {Translate(title, language)}
          </p>
          <p className="text-info text-align" style={style.info}>
            {Translate(info, language)}
          </p>
        </Grid>

        <Grid item xs={2} sm={1} style={style.disabledColor}>
          {EndAdornment ? (
            <EndAdornment />
          ) : I18nManager.isRTL ? (
            <KeyboardArrowLeftOutlined fontSize="large" />
          ) : (
            <KeyboardArrowRightOutlined fontSize="large" />
          )}
        </Grid>
      </Grid>

      <Grid container>{Collapse && <Collapse />}</Grid>
    </Grid>
  );
};

export default SettingBar;
