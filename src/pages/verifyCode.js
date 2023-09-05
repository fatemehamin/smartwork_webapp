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

  const [openSnackbar] = useSnackbar();
  const { userInfo, isLoading } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.i18n);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  useEffect(() => {
    if (code.length === 5) {
      HandleVerifyCode();
    }
  }, [code]);

  const HandleReSendCode = () => {
    setIsResendCode(true);
    setStartTime(() => new Date().getTime());
    setTime(120);

    type === "forgotPassword"
      ? dispatch(forgotPassword(userInfo))
      : dispatch(createUserLoading(userInfo));
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

    const args = { type, code, userInfo };

    setIsResendCode(false);
    dispatch(verifyCode(args))
      .unwrap()
      .then((res) =>
        navigate(type === "createUser" ? "/login" : "/changePassword")
      )
      .catch(_error);
  };

  return (
    <>
      <AppBar label="verificationCode" type="back" />
      <div className="Verify_description direction">
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
        isLoading={!isResendCode && isLoading}
        label={Translate("verifyCode", language)}
        onClick={HandleVerifyCode}
        disabled={code.length < 5}
      />
    </>
  );
};

export default VerifyCode;
