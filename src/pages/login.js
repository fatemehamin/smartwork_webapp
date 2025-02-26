import React, { useState, useRef } from "react";
import Logo from "../assets/images/Logo.svg";
import Button from "../components/button";
import Input from "../components/input";
import ChangeLanguageBtn from "../components/changeLanguageBtn";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { login } from "../features/auth/action";
import { changeLanguage } from "../features/i18n/action";
import "./login.css";

const Login = () => {
  const { isLoading, userInfo } = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.i18n);

  const [password, setPassword] = useState("");
  const [country, setCountry] = useState(userInfo?.country);
  const [callingCode, setCallingCode] = useState(userInfo?.callingCode);
  const [phoneNumber, setPhoneNumber] = useState(userInfo?.phoneNumber);

  const [openSnackbar] = useSnackbar();

  const passwordInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignup = () => navigate("/signup");

  const handleLogin = () => {
    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "400"
          ? Translate("enterPhoneNumberOrPassword", language)
          : error.message.slice(-3) === "401"
          ? Translate("incorrectPhoneNumberOrPassword", language)
          : error.message
      );
    };

    const _then = (res) => {
      navigate(
        res.type === "boss" || res.type === "admin" ? "/manager" : "/myTasks"
      );
      dispatch(changeLanguage(language)); // after authentication need to save language
    };

    const args = { country, callingCode, phoneNumber, password };

    dispatch(login(args)).unwrap().then(_then).catch(_error);
  };

  const onKeyDownPhoneNumber = (e) => {
    if (e.keyCode === 13) {
      passwordInputRef.current.focus();
    }
  };

  const onKeyDownPassword = (e) => {
    if (e.keyCode === 13) {
      handleLogin();
    }
  };

  return (
    <div className="login">
      <img src={Logo} className="login-Logo" alt="Logo" />
      <div className="login_body">
        <Input
          value={phoneNumber}
          setValue={setPhoneNumber}
          label={Translate("phoneNumber", language)}
          placeholder={Translate("phoneNumber", language)}
          country={country}
          setCountry={setCountry}
          callingCode={callingCode}
          setCallingCode={setCallingCode}
          onKeyDown={onKeyDownPhoneNumber}
        />
        <Input
          value={password}
          setValue={setPassword}
          label={Translate("password", language)}
          placeholder={Translate("password", language)}
          type="password"
          Icon={LockOutlined}
          onKeyDown={onKeyDownPassword}
          ref={passwordInputRef}
        />
        <Link to="/forgotPassword" className="forgotPassword_btn text-align">
          {Translate("forgotPassword?", language)}
        </Link>
        <Button
          label={Translate("login", language)}
          onClick={handleLogin}
          isLoading={isLoading}
        />
        <Button
          label={Translate("signup", language)}
          onClick={handleSignup}
          type="SECONDARY"
        />
        <ChangeLanguageBtn />
      </div>
    </div>
  );
};

export default Login;
