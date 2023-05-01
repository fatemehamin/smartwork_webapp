import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../redux/action/authAction";
import { useEffect } from "react";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../i18n";

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [isPress, setIsPress] = useState(false);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const stateAuth = useSelector((state) => state.authReducer);
  const { language } = useSelector((state) => state.configReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    isPress && stateAuth.isError && openSnackbar(stateAuth.error);
  }, [stateAuth.isError]);

  const onSendHandler = () => {
    setIsPress(true);
    dispatch(
      forgotPassword(callingCode, phoneNumber, country, navigate, setIsPress)
    );
  };

  return (
    <>
      <AppBar label={Translate("forgotPassword", language)} type="back" />
      <p style={styles.text}>{Translate("enterYourPhoneNumber", language)}</p>
      <Input
        value={phoneNumber}
        setValue={setPhoneNumber}
        label={Translate("phoneNumber", language)}
        placeholder={Translate("phoneNumber", language)}
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        msgError={stateAuth.isError ? stateAuth.error.phoneNumberError : ""}
      />
      <Button
        label={Translate("sendCode", language)}
        disabled={phoneNumber === callingCode}
        onClick={onSendHandler}
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

export default ForgotPassword;
