import React, { useState, forwardRef } from "react";
import "./Input.css";
import { Input, InputAdornment } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

export default forwardRef(
  (
    {
      value,
      setValue,
      label,
      type,
      msgError,
      country,
      setCountry,
      callingCode,
      setCallingCode,
      Icon,
      ...props
    },
    ref
  ) => {
    const [visiblePassword, setVisiblePassword] = useState(false);
    return (
      <div className="container">
        <p className="titleInputContainer">{label}</p>
        {callingCode ? (
          <MuiPhoneNumber
            defaultCountry={country.toLowerCase()}
            onChange={(phoneNumber, details) => {
              setCallingCode(`+${details.dialCode}`);
              setValue(phoneNumber);
              setCountry(details.countryCode);
            }}
            className="input"
            error={msgError ? true : false}
            {...props}
            ref={ref}
          />
        ) : (
          <Input
            className="input"
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
            }
            type={visiblePassword ? "text" : type}
            {...props}
            ref={ref}
          />
        )}
        {msgError ? <p className="msgError">{msgError}</p> : null}
      </div>
    );
  }
);
const styles = {
  IconSize: { fontSize: 18 },
};
