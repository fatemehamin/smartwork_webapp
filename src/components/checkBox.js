import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import "./checkBox.css";

const CheckBox = ({ name, toggle, disabled, onChange, style, sx }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  useEffect(() => {
    setToggleCheckBox(toggle);
  }, [toggle]);

  return (
    <FormGroup className="text-align direction" style={style}>
      <FormControlLabel
        sx={sx}
        label={name}
        control={
          <Checkbox
            color="primary"
            disabled={disabled}
            checked={toggleCheckBox}
            onChange={onChange}
          />
        }
      />
    </FormGroup>
  );
};

export default CheckBox;
