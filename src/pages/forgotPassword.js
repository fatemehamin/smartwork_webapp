import React, { useState } from "react";
import AppBar from "../components/appBar";
import Input from "../components/input";
import Button from "../components/button";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/auth/action";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [openSnackbar] = useSnackbar();
  const stateAuth = useSelector((state) => state.auth);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handelSendCode = () => {
    dispatch(forgotPassword({ callingCode, phoneNumber, country }))
      .unwrap()
      .then((res) => navigate(`/verifyCode/${phoneNumber}/forgotPassword`))
      .catch((error) =>
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message.slice(-3) === "404"
            ? Translate("phoneNumberNotExists", language)
            : error.message
        )
      );
  };

  return (
    <>
      <AppBar label="forgotPassword" type="back" />
      <p className={`forgot_pass_text ${I18nManager.isRTL ? "rtl" : "ltr"}`}>
        {Translate("enterYourPhoneNumber", language)}
      </p>
      <Input
        value={phoneNumber}
        setValue={setPhoneNumber}
        label={Translate("phoneNumber", language)}
        placeholder={Translate("phoneNumber", language)}
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
      />
      <Button
        label={Translate("sendCode", language)}
        disabled={phoneNumber === callingCode}
        onClick={handelSendCode}
        isLoading={stateAuth.isLoading}
      />
    </>
  );
};

export default ForgotPassword;
