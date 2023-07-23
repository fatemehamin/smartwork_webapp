import React from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";
import jMoment from "moment-jalaali";
import "./picker.css";

const Calender = ({
  month,
  setMonth,
  year,
  setYear,
  isCalendar,
  onePicker,
  label,
}) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const sx = { m: 1, minWidth: 150 };
  const onChangeYear = (event) => setYear(event.target.value);
  const onChangeMonth = (event) => setMonth(event.target.value);
  const onChangePicker = (event) => onePicker.onSelect(event.target.value);

  const jMonth = [
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
    <div className={`picker ${I18nManager.isRTL ? "rtl" : "ltr"}`}>
      <div className="picker-text">{label}</div>
      <FormControl sx={sx}>
        <InputLabel>{Translate("user", language)}</InputLabel>
        <Select
          value={onePicker.init}
          onChange={onChangePicker}
          displayEmpty
          label="User"
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
      <FormControl sx={sx} key="Year">
        <InputLabel id="demo-simple-select-helper-label">
          {Translate("year", language)}
        </InputLabel>
        <Select value={year} onChange={onChangeYear} displayEmpty label="Year">
          {getYears().map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={sx} key="Month">
        <InputLabel id="demo-simple-select-helper-label">
          {Translate("month", language)}
        </InputLabel>
        <Select
          value={month}
          onChange={onChangeMonth}
          displayEmpty
          label="Month"
        >
          {jMonth.map((m, i) => (
            <MenuItem key={i} value={i}>
              {m}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
};

export default Calender;
