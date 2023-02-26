import React from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
import jMoment from "moment-jalaali";

export default ({
  month,
  setMonth,
  year,
  setYear,
  isCalendar,
  onePicker,
  label,
}) => {
  const JMonth = [
    "Farvardin",
    "Ordibehesht",
    "Khordad",
    "Tir",
    "Mordad",
    "Shahrivar",
    "Mehr",
    "Aban",
    "Azar",
    "Dey",
    "Bahman",
    "Esfand",
  ];
  const getYears = () => {
    let Years = [];
    for (let y = 1400; y <= jMoment(new Date()).jYear(); y++) {
      Years = [...Years, y.toString()];
    }
    return Years;
  };
  return !isCalendar ? (
    <div style={styles.onePickerContainer}>
      <div style={styles.text}>{label}</div>
      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel id="demo-simple-select-helper-label">Member</InputLabel>
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
        <InputLabel id="demo-simple-select-helper-label">Year</InputLabel>
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
        <InputLabel id="demo-simple-select-helper-label">Month</InputLabel>
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
    fontWeight: "400",
    fontSize: 15,
    paddingLeft: 10,
    textAlign: "left",
  },
  onePickerContainer: {
    flexDirection: "row",
    display: "flex",
    alignItems: "center",
  },
};
