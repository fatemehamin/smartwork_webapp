import React, { useState } from "react";
import "./Input.css";
import { Input, InputAdornment } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useSelector } from "react-redux";

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
  const { I18nManager } = useSelector((state) => state.configReducer);
  return (
    <div
      className="input_container"
      style={styles.container(I18nManager.isRTL, callingCode)}
    >
      <p
        className="titleInputContainer"
        style={styles.textAlign(I18nManager.isRTL)}
      >
        {label}
      </p>
      {callingCode ? (
        <MuiPhoneNumber
          defaultCountry={country.toLowerCase()}
          onChange={(phoneNumber, details) => {
            setCallingCode(`+${details.dialCode}`);
            setValue(phoneNumber);
            setCountry(details.countryCode);
          }}
          style={customStyle}
          inputProps={{ maxLength: callingCode == "+98" ? 13 : undefined }}
          className="input"
          error={msgError ? true : false}
          {...props}
        />
      ) : (
        <Input
          className="input"
          style={customStyle}
          error={msgError ? true : false}
          onChange={(event) => setValue(event.target.value)}
          startAdornment={
            Icon && (
              <InputAdornment position="start">
                <Icon className="icon" style={styles.IconSize} />
              </InputAdornment>
            )
          }
          endAdornment={
            IconEnd ? (
              <InputAdornment position="end">
                <IconEnd className="icon" style={styles.IconSize} />
              </InputAdornment>
            ) : (
              type == "password" && (
                <InputAdornment position="end">
                  {visiblePassword ? (
                    <VisibilityOffOutlined
                      className="icon"
                      style={styles.IconSize}
                      onClick={() => setVisiblePassword(!visiblePassword)}
                    />
                  ) : (
                    <VisibilityOutlined
                      className="icon"
                      style={styles.IconSize}
                      onClick={() => setVisiblePassword(!visiblePassword)}
                    />
                  )}
                </InputAdornment>
              )
            )
          }
          type={visiblePassword ? "text" : type}
          {...props}
        />
      )}
      {msgError ? (
        <p className="msgError" style={styles.textAlign(I18nManager.isRTL)}>
          {msgError}
        </p>
      ) : null}
    </div>
  );
};

const styles = {
  IconSize: { fontSize: 18 },
  container: (isRTL, callingCode) => ({
    direction: isRTL && !callingCode ? "rtl" : "ltr",
  }),
  textAlign: (isRTL) => ({
    textAlign: isRTL ? "right" : "left",
  }),
};

export default CustomInput;
