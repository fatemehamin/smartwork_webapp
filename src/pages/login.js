import React, { useState, useRef, useEffect } from "react";
import Logo from "../assets/images/Logo.png";
import "./login.css";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";

// import { useDispatch, useSelector } from "react-redux";
// import { login } from "../redux/action/authAction";

export default () => {
  // const stateAuth = useSelector((state) => state.authReducer);
  // const dispatch = useDispatch();
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const ref_input2 = useRef();
  const navigation = useNavigate();
  return (
    <div className="login">
      <img src={Logo} className="Logo" alt="Logo" />
      <div className="login_body">
        <Input
          value={phoneNumber}
          setValue={setPhoneNumber}
          className="input"
          label="Phone Number"
          placeholder="Phone Number"
          country={country}
          // setCountry={setCountry}
          callingCode={callingCode}
          // setCallingCode={setCallingCode}
          // returnKeyType="next"
          // keyboardType="numeric"
          // inputRef={(el) => (ref_input2.current = el)}
          // onSubmitEditing={() => ref_input2.current.focus()}
        />
        <Input
          value={password}
          setValue={setPassword}
          label="Password"
          placeholder="Password"
          type="password"
          Icon={LockOutlined}
          // nameIcon="lock"
          // returnKeyType="done"
          // ref={ref_input2}
        />
        <Link to="/forgotPassword" className="forgotPassword_btn">
          Forgot password?
        </Link>
        <Button
          label="Login"
          onClick={() => {
            console.log("login");
            // dispatch(
            //   login(country, callingCode, callingCode + phoneNumber, password)
            // );
          }}
          //   isLoading={stateAuth.isLoading}
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
