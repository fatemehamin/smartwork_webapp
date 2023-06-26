import React, { useState, useEffect } from "react";
import AppBar from "../components/appBar";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/button";
import CodeField from "../components/codeField";
import "./verifyCode.css";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import {
  createUserLoading,
  forgotPassword,
  verifyCode,
} from "../features/auth/action";

const VerifyCode = () => {
  const { phoneNumber, type } = useParams();
  const [code, setCode] = useState("");
  const [time, setTime] = useState(120);
  const [isResendCode, setIsResendCode] = useState(false);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const stateAuth = useSelector((state) => state.auth);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSnackbar] = useSnackbar();

  useEffect(() => {
    //---------------------------- timer ----------------------------//
    if (time >= 0) {
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        setTime(() => Math.round((startTime + 120000 - now) / 1000));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [time, startTime]);

  const HandleReSendCode = () => {
    setIsResendCode(true);
    setStartTime(() => new Date().getTime());
    setTime(120);
    type === "forgotPassword"
      ? dispatch(
          forgotPassword({
            callingCode: stateAuth.userInfo.callingCode,
            phoneNumber: stateAuth.userInfo.phoneNumber,
            country: stateAuth.userInfo.country,
          })
        )
      : dispatch(
          createUserLoading({
            firstName: stateAuth.userInfo.firstName,
            lastName: stateAuth.userInfo.lastName,
            companyName: stateAuth.userInfo.companyName,
            country: stateAuth.userInfo.country,
            callingCode: stateAuth.userInfo.callingCode,
            phoneNumber: stateAuth.userInfo.phoneNumber,
            password: stateAuth.userInfo.password,
          })
        );
  };

  const HandleVerifyCode = () => {
    setIsResendCode(false);
    dispatch(verifyCode({ type, code, userInfo: stateAuth.userInfo }))
      .unwrap()
      .then((res) =>
        navigate(type === "createUser" ? "/login" : "/changePassword")
      )
      .catch((error) =>
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message.slice(-3) === "401"
            ? Translate("verifyCodeIncorrect", language)
            : error.message
        )
      );
  };

  const className = {
    description: `Verify_description ${I18nManager.isRTL ? "rtl" : "ltr"}`,
  };

  return (
    <>
      <AppBar label="verificationCode" type="back" />
      <div className={className.description}>
        {Translate("typeVerificationCode", language)}
        <br />
        {phoneNumber}
      </div>
      <CodeField code={code} setCode={setCode} cellCount={5} />
      <div className="Verify_timer">
        {time >= 0 ? (
          <span className="Verify_textResend">
            {Translate("reSendCodeIn", language) +
              time +
              Translate("seconds", language)}
          </span>
        ) : (
          <div onClick={HandleReSendCode}>
            <span className="Verify_textTimeout">
              {Translate("reSendCode", language)}
            </span>
          </div>
        )}
      </div>
      <Button
        isLoading={!isResendCode && stateAuth.isLoading}
        label={Translate("verifyCode", language)}
        onClick={HandleVerifyCode}
        disabled={code.length < 5}
      />
    </>
  );
};

export default VerifyCode;
