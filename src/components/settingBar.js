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
  title,
  info,
  Icon,
  EndAdornment,
  Collapse,
  color = "#176085",
  ...props
}) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);

  const styleTitle = { color: color !== "#176085" && color };

  return (
    <Grid container>
      <Grid container className="setting-bar-container direction" {...props}>
        <Grid item xs={2} sm={1} className="display-flex-center">
          <Icon className="icon_bar" style={{ color }} />
        </Grid>

        <Grid item xs={8} sm={10}>
          <p style={styleTitle} className="text-title text-align">
            {Translate(title, language)}
          </p>
          <p className="text-info text-align">{Translate(info, language)}</p>
        </Grid>

        <Grid item xs={2} sm={1} style={{ color }}>
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
