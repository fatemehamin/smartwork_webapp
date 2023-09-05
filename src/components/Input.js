import React, { useState, forwardRef } from "react";
import { Input, InputAdornment } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";
import "./input.css";

const CustomInput = forwardRef(
  (
    {
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
    },
    ref
  ) => {
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
        <p className="input-label text-align direction">{label}</p>
        {callingCode ? (
          <MuiPhoneNumber
            className="input"
            style={customStyle}
            error={msgError ? true : false}
            onChange={onChangePhoneNumber}
            defaultCountry={country.toLowerCase()}
            inputProps={{
              maxLength: callingCode === "+98" ? 13 : undefined,
              ref: ref,
            }}
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
            inputRef={ref}
            {...props}
          />
        )}
        {msgError && (
          <p className="input_msgError text-align direction">{msgError}</p>
        )}
      </div>
    );
  }
);

export default CustomInput;
