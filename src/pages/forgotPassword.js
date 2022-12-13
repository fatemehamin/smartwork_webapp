import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/action/authAction";
import { useEffect } from "react";
import { useSnackbar } from "react-simple-snackbar";

export default () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const stateAuth = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    stateAuth.isError && openSnackbar(stateAuth.error);
  }, [stateAuth.isError]);
  return (
    <>
      <AppBar label="Forgot password" type="back" />
      <p style={styles.text}>
        Please enter your phone number to recover your password.
      </p>
      <Input
        value={phoneNumber}
        setValue={setPhoneNumber}
        label="Phone Number"
        placeholder="Phone Number"
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        msgError={stateAuth.isError ? stateAuth.error.phoneNumberError : ""}
      />
      <Button
        label="Verify code"
        disabled={phoneNumber == ""}
        onClick={() => dispatch(forgotPassword(phoneNumber, navigate))}
        isLoading={stateAuth.isLoading}
      />
    </>
  );
};
const styles = {
  text: {
    marginLeft: "10%",
    marginBottom: 30,
    textAlign: "left",
  },
};
