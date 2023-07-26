import React, { useEffect, useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import "./checkBox.css";

const CheckBox = ({ name, toggle, disabled, onChange }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);

  useEffect(() => {
    setToggleCheckBox(toggle);
  }, [toggle]);

  return (
    <FormGroup className="text-align direction" style={{ marginLeft: 16 }}>
      <FormControlLabel
        control={
          <Checkbox
            color="secondary"
            disabled={disabled}
            checked={toggleCheckBox}
            onChange={onChange}
          />
        }
        label={name}
      />
    </FormGroup>
  );
};

export default CheckBox;
