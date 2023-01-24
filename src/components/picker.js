import React from "react";
import { MenuItem, FormControl, Select, InputLabel } from "@mui/material";
// import {WheelPicker} from 'react-native-wheel-picker-android';
import jMoment from "moment-jalaali";
// import {Picker} from '@react-native-picker/picker';

export default ({
  month,
  setMonth,
  year,
  setYear,
  // isCalendar,
  // onePicker,
  // customStyle,
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
  return (
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
    //   {/*
    //   <View style={styles.selectDate}>
    //   {!isCalendar ? (
    //     <View style={styles.onePickerContainer}>
    //       <Text style={styles.text}>{label}</Text>
    //       <Picker
    //         style={styles.onePicker}
    //         itemStyle={{fontSize: 15}}
    //         selectedValue={onePicker.init}
    //         onValueChange={(itemValue, itemIndex) =>
    //           onePicker.onSelect(itemValue)
    //         }>
    //         {onePicker.data.map((info, index) => (
    //           <Picker.Item label={info} value={index} key={index} />
    //         ))}
    //       </Picker>
    //     </View>
    //   ) : Platform.OS == 'android' ? (
    //     <>
    //       <WheelPicker
    //         data={getYears()}
    //         onItemSelected={selectedYear => setYear(getYears()[selectedYear])}
    //         initPosition={getYears().findIndex(y => y == year)}
    //         style={customStyle}
    //       />
    //       <WheelPicker
    //         data={JMonth}
    //         onItemSelected={selectedItem => setMonth(selectedItem)}
    //         initPosition={month}
    //         style={customStyle}
    //       />
    //     </>
    //   ) : (
    //     <>
    //       <Picker
    //         style={{width: isCalendar ? '24%' : '50%'}}
    //         itemStyle={{fontSize: isCalendar ? 15 : 21}}
    //         selectedValue={year}
    //         onValueChange={(itemValue, itemIndex) => setYear(itemValue)}>
    //         {getYears().map((y, index) => (
    //           <Picker.Item label={y} value={y} key={index} />
    //         ))}
    //       </Picker>
    //       <Picker
    //         style={{width: isCalendar ? '32%' : '50%'}}
    //         itemStyle={{fontSize: isCalendar ? 15 : 21}}
    //         selectedValue={month}
    //         onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}>
    //         {JMonth.map((jMonth, index) => (
    //           <Picker.Item label={jMonth} value={index} key={index} />
    //         ))}
    //       </Picker>
    //     </>
    //   )}
    // </View> */}
  );
};

const styles = {
  selectDate: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
    width: "100%",
  },
  text: {
    color: "#000",
    fontWeight: "400",
    fontSize: 15,
    paddingLeft: 10,
    textAlign: "left",
  },
  onePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  onePicker: { width: "60%", backgroundColor: "#17608510" },
};
