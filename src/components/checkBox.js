import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import {
  addLocationToEmployee,
  DeleteLocationFromEmployee,
} from "../redux/action/managerAction";

export default ({
  name,
  toggle,
  employeeCurrentPhone,
  disabled,
  type = "Location",
  setFilterProject,
  FilterProject,
}) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    setToggleCheckBox(toggle);
  }, [toggle]);
  // const onPressHandler = (e) => {
  //   type == "Location"
  //     ? e.target.checked
  //       ? dispatch(
  //           addLocationToEmployee(employeeCurrentPhone, name, setToggleCheckBox)
  //         )
  //       : dispatch(
  //           DeleteLocationFromEmployee(
  //             employeeCurrentPhone,
  //             name,
  //             setToggleCheckBox
  //           )
  //         )
  //     : (toggleCheckBox
  //         ? setFilterProject(
  //             FilterProject.filter((project) => project !== name)
  //           )
  //         : setFilterProject([...FilterProject, name]),
  //       setToggleCheckBox(!toggleCheckBox));
  // };

  return (
    <FormGroup style={styles.container}>
      <FormControlLabel
        control={
          <Checkbox
            color="secondary"
            disabled={disabled}
            // onChange={onPressHandler}
          />
        }
        label={name}
      />
    </FormGroup>
  );
};
const styles = {
  container: {
    flexDirection: "row",
    padding: 5,
    marginLeft: "10%",
    alignItems: "center",
  },
};
