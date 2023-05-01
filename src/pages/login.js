import React, { useEffect, useState } from "react";
import Logo from "../assets/images/Logo.png";
import "./login.css";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/action/authAction";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../i18n";
import { changeLanguage } from "../redux/action/configAction";
import ChangeLanguageBtn from "../components/changeLanguageBtn";

const Login = () => {
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [password, setPassword] = useState("");
  const [isPress, setIsPress] = useState(false);
  const [isEN, setIsEN] = useState(false);
  const navigation = useNavigate();
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stateAuth = useSelector((state) => state.authReducer);
  const { language, I18nManager } = useSelector((state) => state.configReducer);

  useEffect(() => {
    isPress && stateAuth.isError && openSnackbar(stateAuth.error);
  }, [stateAuth.isError]);

  const onLoginHandler = () => {
    setIsPress(true);
    dispatch(
      login(country, callingCode, phoneNumber, password, setIsPress, navigate)
    );
  };

  return (
    <div className="login">
      <img src={Logo} className="Logo" alt="Logo" />
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
        <Link
          to="/forgotPassword"
          style={styles.textAlign(I18nManager.isRTL)}
          className="forgotPassword_btn"
        >
          {Translate("forgotPassword?", language)}
        </Link>
        <Button
          label={Translate("login", language)}
          onClick={onLoginHandler}
          isLoading={stateAuth.isLoading}
        />
        <Button
          label={Translate("signup", language)}
          type="SECONDARY"
          onClick={() => navigation("/signup")}
        />
        <ChangeLanguageBtn />
      </div>
    </div>
  );
};

const styles = {
  textAlign: (isRTL) => ({
    textAlign: isRTL ? "right" : "left",
  }),
};

export default Login;
