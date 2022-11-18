import React, { useState, forwardRef } from "react";
import "./Input.css";
import * as Icon from "@mui/icons-material";
import { Input, InputAdornment } from "@mui/material";
import MuiPhoneNumber from "material-ui-phone-number";
// import Icon from "react-native-vector-icons/Feather";
// import CountryCodePicker from "./countryCodePicker";
// import InputUI from "@material-ui/core/Input";

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
      ...props
    },
    ref
  ) => {
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [isFocus, setIsFocus] = useState(false);
    const style = {
      div: { borderColor: isFocus ? "#442C2E" : "#aaa" },
      IconSize: { fontSize: 18 },
    };
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
            // className="input"
            error={msgError ? true : false}
            // secureTextEntry={secureTextEntry && !visiblePassword}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            // maxLength={callingCode == "+98" ? 10 : undefined}
            {...props}
            ref={ref}
            // selectionColor="#f
          />
        ) : (
          <Input
            className="input"
            error={msgError ? true : false}
            onChange={(event) => setValue(event.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Icon.LockOutlined className="icon" style={style.IconSize} />
              </InputAdornment>
            }
            endAdornment={
              type == "password" && (
                <InputAdornment position="end">
                  {visiblePassword ? (
                    <Icon.VisibilityOffOutlined
                      className="icon"
                      style={style.IconSize}
                      onClick={() => setVisiblePassword(!visiblePassword)}
                    />
                  ) : (
                    <Icon.VisibilityOutlined
                      className="icon"
                      style={style.IconSize}
                      onClick={() => setVisiblePassword(!visiblePassword)}
                    />
                  )}
                </InputAdornment>
              )
            }
            type={visiblePassword ? "text" : type}
            // secureTextEntry={secureTextEntry && !visiblePassword}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            // maxLength={callingCode == "+98" ? 10 : undefined}
            {...props}
            ref={ref}
            // selectionColor="#f6921e"
          />
        )}
        {msgError ? <p className="msgError">{msgError}</p> : null}
      </div>
    );
  }
);
