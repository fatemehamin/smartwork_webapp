import React, { useState } from "react";
import "./Input.css";
import { Input, InputAdornment } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

export default ({
  value,
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
  return (
    <div className="input_container">
      <p className="titleInputContainer">{label}</p>
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
          value={value}
          {...props}
        />
      )}
      {msgError ? <p className="msgError">{msgError}</p> : null}
    </div>
  );
};

const styles = {
  IconSize: { fontSize: 18 },
};