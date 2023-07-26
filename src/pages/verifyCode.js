import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import AppBar from "../components/appBar";
import Button from "../components/button";
import CodeField from "../components/codeField";
import "./verifyCode.css";
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
  const { language } = useSelector((state) => state.i18n);
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

    const args =
      type === "forgotPassword"
        ? {
            callingCode: stateAuth.userInfo.callingCode,
            phoneNumber: stateAuth.userInfo.phoneNumber,
            country: stateAuth.userInfo.country,
          }
        : {
            firstName: stateAuth.userInfo.firstName,
            lastName: stateAuth.userInfo.lastName,
            companyName: stateAuth.userInfo.companyName,
            country: stateAuth.userInfo.country,
            callingCode: stateAuth.userInfo.callingCode,
            phoneNumber: stateAuth.userInfo.phoneNumber,
            password: stateAuth.userInfo.password,
          };
    type === "forgotPassword"
      ? dispatch(forgotPassword(args))
      : dispatch(createUserLoading(args));
  };

  const HandleVerifyCode = () => {
    const _error = (error) =>
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "401"
          ? Translate("verifyCodeIncorrect", language)
          : error.message
      );

    const args = { type, code, userInfo: stateAuth.userInfo };

    setIsResendCode(false);
    dispatch(verifyCode(args))
      .unwrap()
      .then((res) =>
        navigate(type === "createUser" ? "/login" : "/changePassword")
      )
      .catch(_error);
  };

  const onKeyDownLastInput = (e) => {
    if (e.keyCode === 13) {
      HandleVerifyCode();
    }
  };

  return (
    <>
      <AppBar label="verificationCode" type="back" />
      <div className="Verify_description direction">
        {Translate("typeVerificationCode", language)}
        <br />
        {phoneNumber}
      </div>
      <CodeField
        code={code}
        setCode={setCode}
        cellCount={5}
        onKeyDownLastInput={onKeyDownLastInput}
      />
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
