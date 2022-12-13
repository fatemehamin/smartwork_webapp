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

export default () => {
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const stateAuth = useSelector((state) => state.authReducer);

  useEffect(() => {
    stateAuth.isError && openSnackbar(stateAuth.error);
  }, [stateAuth.isError]);

  return (
    <div className="login">
      <img src={Logo} className="Logo" alt="Logo" />
      <div className="login_body">
        <Input
          value={phoneNumber}
          setValue={setPhoneNumber}
          label="Phone Number"
          placeholder="Phone Number"
          country={country}
          setCountry={setCountry}
          callingCode={callingCode}
          setCallingCode={setCallingCode}
        />
        <Input
          value={password}
          setValue={setPassword}
          label="Password"
          placeholder="Password"
          type="password"
          Icon={LockOutlined}
        />
        <Link to="/forgotPassword" className="forgotPassword_btn">
          Forgot password?
        </Link>
        <Button
          label="Login"
          onClick={() =>
            dispatch(login(country, callingCode, phoneNumber, password))
          }
          isLoading={stateAuth.isLoading}
        />
        <Button
          label="Signup"
          type="SECONDARY"
          onClick={() => navigation("/signup")}
        />
      </div>
    </div>
  );
};
