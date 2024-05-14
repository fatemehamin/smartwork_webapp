import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import "./checkBox.css";

const CheckBox = ({ name, toggle, style, sx, ...props }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  useEffect(() => {
    setToggleCheckBox(toggle);
  }, [toggle]);

  return (
    <FormGroup className="text-align direction" style={style}>
      <FormControlLabel
        sx={{ width: "100%", margin: 0, ...sx }}
        label={name}
        control={
          <Checkbox color="primaryDark" checked={toggleCheckBox} {...props} />
        }
      />
    </FormGroup>
  );
};

export default CheckBox;
