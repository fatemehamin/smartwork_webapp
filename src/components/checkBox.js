import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import "./checkBox.css";

const CheckBox = ({ name, toggle, disabled, onChange }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const { I18nManager } = useSelector((state) => state.i18n);

  useEffect(() => {
    setToggleCheckBox(toggle);
  }, [toggle]);

  return (
    <FormGroup
      className={I18nManager.isRTL ? "rtl text-right" : "ltr text-left"}
      style={{ marginLeft: 16 }}
    >
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
