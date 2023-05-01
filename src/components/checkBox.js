import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import {
  addLocationToEmployee,
  DeleteLocationFromEmployee,
} from "../redux/action/managerAction";

const CheckBox = ({
  name,
  toggle,
  employeeCurrentPhone,
  disabled,
  type = "Location",
  setFilterProject,
  FilterProject,
}) => {
  console.log(
    "fff",
    name,
    toggle,
    employeeCurrentPhone,
    disabled,
    type,
    setFilterProject,
    FilterProject
  );
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const { I18nManager } = useSelector((state) => state.configReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    setToggleCheckBox(toggle);
  }, [toggle]);

  const onPressHandler = (e) => {
    return type == "Location"
      ? e.target.checked
        ? dispatch(
            addLocationToEmployee(employeeCurrentPhone, name, setToggleCheckBox)
          )
        : dispatch(
            DeleteLocationFromEmployee(
              employeeCurrentPhone,
              name,
              setToggleCheckBox
            )
          )
      : (toggleCheckBox
          ? setFilterProject(
              FilterProject.filter((project) => project !== name)
            )
          : setFilterProject([...FilterProject, name]),
        setToggleCheckBox(!toggleCheckBox));
  };

  return (
    <FormGroup style={styles.container(I18nManager.isRTL)}>
      <FormControlLabel
        control={
          <Checkbox
            color="secondary"
            disabled={disabled}
            checked={toggleCheckBox}
            onChange={onPressHandler}
          />
        }
        label={name}
      />
    </FormGroup>
  );
};
const styles = {
  container: (isRTL) => ({
    direction: isRTL ? "rtl" : "ltr",
    padding: 5,
    marginLeft: "10%",
  }),
};

export default CheckBox;
