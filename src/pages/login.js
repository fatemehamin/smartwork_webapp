import React, { useState } from "react";
import Logo from "../assets/images/Logo.png";
import Button from "../components/button";
import Input from "../components/input";
import ChangeLanguageBtn from "../components/changeLanguageBtn";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { login } from "../features/auth/action";
import "./login.css";

const Login = () => {
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openSnackbar] = useSnackbar();
  const stateAuth = useSelector((state) => state.auth);
  const { language, I18nManager } = useSelector((state) => state.i18n);

  const className = {
    forgotPass: `forgotPassword_btn ${
      I18nManager.isRTL ? "text-right" : "text-left"
    }`,
  };

  const handleSignup = () => navigate("/signup");

  const handleLogin = () => {
    dispatch(login({ country, callingCode, phoneNumber, password }))
      .unwrap()
      .then((res) => {
        navigate(res.type === "boss" ? "/manager" : "/myTasks");
      })
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message.slice(-3) === "400"
            ? Translate("enterPhoneNumberOrPassword", language)
            : error.message.slice(-3) === "401"
            ? Translate("incorrectPhoneNumberOrPassword", language)
            : error.message
        );
      });
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
        />
        <Input
          value={password}
          setValue={setPassword}
          label={Translate("password", language)}
          placeholder={Translate("password", language)}
          type="password"
          Icon={LockOutlined}
        />
        <Link to="/forgotPassword" className={className.forgotPass}>
          {Translate("forgotPassword?", language)}
        </Link>
        <Button
          label={Translate("login", language)}
          onClick={handleLogin}
          isLoading={stateAuth.isLoading}
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
