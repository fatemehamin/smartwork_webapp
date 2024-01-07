import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { createUserLoading, phoneNumberCheck } from "../features/auth/action";
import AppBar from "../components/appBar";
import Input from "../components/input";
import Button from "../components/button";
import msgError from "../utils/msgError";
import "./signup.css";
import {
  PersonOutlineOutlined,
  WorkOutlineOutlined,
  LockOutlined,
} from "@mui/icons-material";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPress, setIsPress] = useState(false);

  const [openSnackbar] = useSnackbar();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { language, I18nManager } = useSelector((state) => state.i18n);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lastNameInputRef = useRef(null);
  const businessInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const rePasswordInputRef = useRef(null);

  const isEmptyFieldPhone = phoneNumber.replace(callingCode, "");

  useEffect(() => {
    // check phoneNumber realtime
    isEmptyFieldPhone && dispatch(phoneNumberCheck(phoneNumber));
  }, [dispatch, isEmptyFieldPhone, phoneNumber]);

  const disableSignup = !(
    password &&
    rePassword &&
    companyName.trim() &&
    phoneNumber !== callingCode &&
    firstName.trim() &&
    lastName.trim()
  );

  const errorMsg = {
    phoneNumber:
      isEmptyFieldPhone &&
      (error === "phoneNumberExists"
        ? Translate("phoneNumberExists", language)
        : error),
    password: isPress && Translate(msgError.password(password), language),
    rePassword:
      isPress && Translate(msgError.rePassword(rePassword, password), language),
  };

  const HandleSignup = () => {
    setIsPress(true);
    const canSave = !(
      msgError.password(password) ||
      msgError.rePassword(rePassword, password) ||
      error
    );

    const args = {
      firstName,
      lastName,
      companyName,
      country,
      callingCode,
      phoneNumber,
      password,
    };

    const _error = (error) =>
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "406"
          ? Translate("businessNameExists", language)
          : error.message
      );

    canSave &&
      dispatch(createUserLoading(args))
        .unwrap()
        .then((res) => navigate(`/verifyCode/${phoneNumber}/createUser`))
        .catch(_error);
  };

  const onKeyDownFirstName = (e) => {
    if (e.keyCode === 13) {
      lastNameInputRef.current.focus();
    }
  };
  const onKeyDownLastName = (e) => {
    if (e.keyCode === 13) {
      businessInputRef.current.focus();
    }
  };
  const onKeyDownBusiness = (e) => {
    if (e.keyCode === 13) {
      phoneInputRef.current.focus();
    }
  };
  const onKeyDownPhone = (e) => {
    if (e.keyCode === 13) {
      passwordInputRef.current.focus();
    }
  };
  const onKeyDownPassword = (e) => {
    if (e.keyCode === 13) {
      rePasswordInputRef.current.focus();
    }
  };
  const onKeyDownRePassword = (e) => {
    if (e.keyCode === 13 && !disableSignup) {
      HandleSignup();
    }
  };

  return (
    <>
      <AppBar label="signup" type="AUTH" />
      <Input
        value={firstName}
        setValue={setFirstName}
        label={Translate("firstName", language)}
        placeholder={Translate("firstName", language)}
        Icon={PersonOutlineOutlined}
        onKeyDown={onKeyDownFirstName}
        autoFocus
      />
      <Input
        value={lastName}
        setValue={setLastName}
        label={Translate("lastName", language)}
        placeholder={Translate("lastName", language)}
        Icon={PersonOutlineOutlined}
        ref={lastNameInputRef}
        onKeyDown={onKeyDownLastName}
      />
      <Input
        value={companyName}
        setValue={setCompanyName}
        label={Translate("businessName", language)}
        placeholder={Translate("businessName", language)}
        Icon={WorkOutlineOutlined}
        ref={businessInputRef}
        onKeyDown={onKeyDownBusiness}
      />
      <Input
        value={phoneNumber}
        setValue={setPhoneNumber}
        label={Translate("phoneNumber", language)}
        placeholder={Translate("phoneNumber", language)}
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        ref={phoneInputRef}
        onKeyDown={onKeyDownPhone}
        msgError={errorMsg.phoneNumber}
      />
      <Input
        value={password}
        setValue={setPassword}
        label={Translate("password", language)}
        placeholder={Translate("password", language)}
        type="password"
        Icon={LockOutlined}
        ref={passwordInputRef}
        onKeyDown={onKeyDownPassword}
        msgError={errorMsg.password}
      />
      <Input
        value={rePassword}
        setValue={setRePassword}
        label={Translate("repeatPassword", language)}
        placeholder={Translate("repeatPassword", language)}
        type="password"
        Icon={LockOutlined}
        ref={rePasswordInputRef}
        onKeyDown={onKeyDownRePassword}
        msgError={errorMsg.rePassword}
      />
      <Button
        label={Translate("signup", language)}
        disabled={disableSignup}
        onClick={HandleSignup}
        isLoading={isLoading}
      />
      <div className="privacy-policy direction">
        {!I18nManager.isRTL && Translate("acceptPrivacyPolicy", language)}
        <span
          onClick={() => navigate("/PrivacyPolicy")}
          className="privacy-policy-btn"
        >
          {Translate("privacyPolicy", language)}
        </span>
        {I18nManager.isRTL && Translate("acceptPrivacyPolicy", language)}
      </div>
    </>
  );
};
export default Signup;
