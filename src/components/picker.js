import React from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import jMoment from "moment-jalaali";
import { Translate } from "../i18n";
import { useSelector } from "react-redux";

const Calender = ({
  month,
  setMonth,
  year,
  setYear,
  isCalendar,
  onePicker,
  label,
}) => {
  const { language, I18nManager } = useSelector((state) => state.configReducer);
  const JMonth = [
    Translate("Farvardin", language),
    Translate("Ordibehesht", language),
    Translate("Khordad", language),
    Translate("Tir", language),
    Translate("Mordad", language),
    Translate("Shahrivar", language),
    Translate("Mehr", language),
    Translate("Aban", language),
    Translate("Azar", language),
    Translate("Dey", language),
    Translate("Bahman", language),
    Translate("Esfand", language),
  ];

  const getYears = () => {
    let Years = [];
    for (let y = 1401; y <= jMoment(new Date()).jYear(); y++) {
      Years = [...Years, y.toString()];
    }
    return Years;
  };
  return !isCalendar ? (
    <div style={styles.onePickerContainer(I18nManager.isRTL)}>
      <div style={styles.text}>{label}</div>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-helper-label">
          {Translate("member", language)}
        </InputLabel>
        <Select
          value={onePicker.init}
          onChange={(event) => onePicker.onSelect(event.target.value)}
          displayEmpty
          label="Member"
        >
          {onePicker.data.map((info, index) => (
            <MenuItem key={index} value={index}>
              {info}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  ) : (
    <>
      <FormControl sx={{ m: 1, minWidth: 150 }} key="Year">
        <InputLabel id="demo-simple-select-helper-label">
          {Translate("year", language)}
        </InputLabel>
        <Select
          value={year}
          onChange={(event) => setYear(event.target.value)}
          displayEmpty
          label="Year"
        >
          {getYears().map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ m: 1, minWidth: 150 }} key="Month">
        <InputLabel id="demo-simple-select-helper-label">
          {Translate("month", language)}
        </InputLabel>
        <Select
          value={month}
          onChange={(event) => setMonth(event.target.value)}
          displayEmpty
          label="Month"
        >
          {JMonth.map((m, index) => (
            <MenuItem key={index} value={index}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

const styles = {
  text: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
    paddingLeft: 10,
    textAlign: "left",
  },
  onePickerContainer: (isRTL) => ({
    direction: isRTL ? "rtl" : "ltr",
    display: "flex",
    alignItems: "center",
  }),
};

export default Calender;
