import React, { useState, forwardRef } from "react";
import "./Input.css";
import { Input, InputAdornment } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";

export default forwardRef(
  (
    {
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
    // const [isFocus, setIsFocus] = useState(false);
    return (
      <div className="container">
        <p className="titleInputContainer">{label}</p>
        {/* <div className="container_div" style={style.div}> */}
        {/* {callingCode && (
            <CountryCodePicker
              setCallingCode={setCallingCode}
              country={country}
              setCountry={setCountry}
            />
          )} */}
        {callingCode ? (
          <MuiPhoneNumber
            defaultCountry={country.toLowerCase()}
            onChange={setCallingCode}
            error={msgError ? true : false}
            // onFocus={() => setIsFocus(true)}
            // onBlur={() => setIsFocus(false)}
            // maxLength={callingCode == "+98" ? 10 : undefined}
            {...props}
            ref={ref}
          />
        ) : (
          <Input
            className="input"
            error={msgError ? true : false}
            onChange={(event) => setValue(event.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Icon className="icon" style={styles.IconSize} />
              </InputAdornment>
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
            // secureTextEntry={secureTextEntry && !visiblePassword}
            // onFocus={() => setIsFocus(true)}
            // onBlur={() => setIsFocus(false)}
            // maxLength={callingCode == "+98" ? 10 : undefined}
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
  // div: { borderColor: isFocus ? "#442C2E" : "#aaa" },
  IconSize: { fontSize: 18 },
};
