import React, { useState } from "react";
import { Input, InputAdornment } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import "./input.css";

const CustomInput = ({
  setValue,
  label,
  type = "text",
  msgError,
  country,
  setCountry,
  callingCode,
  setCallingCode,
  Icon,
  IconEnd,
  customStyle,
  ...props
}) => {
  const [visiblePassword, setVisiblePassword] = useState(false);
  const { I18nManager } = useSelector((state) => state.i18n);
  const onChangeInput = (event) => setValue(event.target.value);

  const onChangePhoneNumber = (phoneNumber, details) => {
    setCallingCode(`+${details.dialCode}`);
    setValue(phoneNumber);
    setCountry(details.countryCode.toUpperCase());
  };

  const toggleVisiblePass = () => {
    setVisiblePassword((VisiblePass) => !VisiblePass);
  };

  const styles = {
    IconSize: { fontSize: 18 },
  };

  const className = {
    container: `input_container ${
      I18nManager.isRTL && !callingCode ? "rtl" : "ltr"
    }`,
    label: `input-label ${
      I18nManager.isRTL ? "rtl text-right" : "ltr text-left"
    }`,
    msgError: `input_msgError ${
      I18nManager.isRTL ? "rtl text-right" : "ltr text-left"
    }`,
  };

  const startAdornment = Icon && (
    <InputAdornment position="start">
      <Icon className="input_icon" style={styles.IconSize} />
    </InputAdornment>
  );

  const endAdornment = IconEnd ? (
    <InputAdornment position="end">
      <IconEnd className="input_icon" style={styles.IconSize} />
    </InputAdornment>
  ) : (
    type === "password" && (
      <InputAdornment position="end">
        {visiblePassword ? (
          <VisibilityOffOutlined
            className="input_icon"
            style={styles.IconSize}
            onClick={toggleVisiblePass}
          />
        ) : (
          <VisibilityOutlined
            className="input_icon"
            style={styles.IconSize}
            onClick={toggleVisiblePass}
          />
        )}
      </InputAdornment>
    )
  );

  return (
    <div className={className.container}>
      <p className={className.label}>{label}</p>
      {callingCode ? (
        <MuiPhoneNumber
          className="input"
          style={customStyle}
          error={msgError ? true : false}
          onChange={onChangePhoneNumber}
          defaultCountry={country.toLowerCase()}
          inputProps={{ maxLength: callingCode === "+98" ? 13 : undefined }}
          {...props}
        />
      ) : (
        <Input
          className="input"
          style={customStyle}
          error={msgError ? true : false}
          onChange={onChangeInput}
          startAdornment={startAdornment}
          endAdornment={endAdornment}
          type={visiblePassword ? "text" : type}
          {...props}
        />
      )}
      {msgError && <p className={className.msgError}>{msgError}</p>}
    </div>
  );
};

export default CustomInput;
