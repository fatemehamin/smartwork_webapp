import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../features/auth/action";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import AppBar from "../components/appBar";
import Input from "../components/input";
import Button from "../components/button";
import "./forgotPassword.css";

const ForgotPassword = () => {
  const { isLoading, userInfo } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.i18n);

  const [country, setCountry] = useState(userInfo.country);
  const [callingCode, setCallingCode] = useState(userInfo.callingCode);
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phoneNumber);

  const [openSnackbar] = useSnackbar();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const disableSendCode = phoneNumber === callingCode;

  const handelSendCode = () => {
    const _error = (error) =>
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "404"
          ? Translate("phoneNumberNotExists", language)
          : error.message
      );
    const args = { callingCode, phoneNumber, country };
    dispatch(forgotPassword(args))
      .unwrap()
      .then((res) => navigate(`/verifyCode/${phoneNumber}/forgotPassword`))
      .catch(_error);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && !disableSendCode) {
      handelSendCode();
    }
  };

  return (
    <>
      <AppBar label="forgotPassword" type="back" />
      <p className="forgot_pass_text direction text-center">
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
        onKeyDown={onKeyDown}
        autoFocus
      />
      <Button
        label={Translate("sendCode", language)}
        disabled={disableSendCode}
        onClick={handelSendCode}
        isLoading={isLoading}
      />
    </>
  );
};

export default ForgotPassword;
