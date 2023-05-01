import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import CodeField from "../components/codeField";
import "./verifyCode.css";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../i18n";
import {
  createUserLoading,
  forgotPassword,
  verifyCode,
} from "../redux/action/authAction";

const VerifyCode = () => {
  const { phoneNumber, type } = useParams();
  const [code, setCode] = useState("");
  const [time, setTime] = useState(120);
  const [isPress, setIsPress] = useState(false);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const stateAuth = useSelector((state) => state.authReducer);
  const { language } = useSelector((state) => state.configReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSnackbar, closeSnackbar] = useSnackbar();

  useEffect(() => {
    isPress && stateAuth.isError && openSnackbar(stateAuth.error);
    //---------------------------- timer ----------------------------//
    if (time >= 0) {
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        setTime(() => Math.round((startTime + 120000 - now) / 1000));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [time, stateAuth.isError, isPress]);

  const onReSendCodeHandler = () => {
    setStartTime(() => new Date().getTime());
    setTime(120);
    type === "forgotPassword"
      ? dispatch(forgotPassword(stateAuth.user.username))
      : dispatch(
          createUserLoading(
            stateAuth.user.firstName,
            stateAuth.user.lastName,
            stateAuth.user.companyName,
            stateAuth.user.country,
            stateAuth.user.callingCode,
            stateAuth.user.phoneNumber,
            stateAuth.user.email,
            stateAuth.user.password
          )
        );
  };

  const onVerifyCodeHandler = () => {
    setIsPress(true);
    dispatch(
      verifyCode(
        code,
        stateAuth.user.email,
        stateAuth.user.firstName,
        stateAuth.user.lastName,
        stateAuth.user.companyName,
        stateAuth.user.password,
        stateAuth.user.country,
        stateAuth.user.callingCode,
        stateAuth.user.phoneNumber,
        navigate,
        type,
        setIsPress
      )
    );
  };

  return (
    <>
      <AppBar label={Translate("verificationCode", language)} type="back" />
      <div className="Verify_description">
        {Translate("typeVerificationCode", language)}
        <br />
        {phoneNumber}
      </div>
      <CodeField code={code} setCode={setCode} cellCount={5} />
      <div className="Verify_timer">
        {time >= 0 ? (
          <span style={styles.textResend}>
            {Translate("reSendCodeIn", language) +
              time +
              Translate("seconds", language)}
          </span>
        ) : (
          <div onClick={onReSendCodeHandler}>
            <span className="Verify_textTimeout">
              {Translate("reSendCode", language)}
            </span>
          </div>
        )}
      </div>
      <Button
        isLoading={stateAuth.isLoading}
        label={Translate("verifyCode", language)}
        onClick={onVerifyCodeHandler}
        disabled={code.length < 5}
      />
    </>
  );
};
const styles = { textResend: { color: "#777" } };
export default VerifyCode;
