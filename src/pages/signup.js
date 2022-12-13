import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import msgError from "../utils/msgError";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import {
  PersonOutlineOutlined,
  WorkOutlineOutlined,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import {
  createUserLoading,
  phoneNumberCheck,
} from "../redux/action/authAction";

export default () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPress, setIsPress] = useState(false);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stateAuth = useSelector((state) => state.authReducer);

  useEffect(() => {
    stateAuth.isError &&
      stateAuth.error.existsCompanyError != undefined &&
      openSnackbar(stateAuth.error.existsCompanyError);
    // check phoneNumber realtime
    callingCode != phoneNumber && dispatch(phoneNumberCheck(phoneNumber));
  }, [phoneNumber, stateAuth.isError]);
  return (
    <>
      <AppBar label="Signup" type="AUTH" />
      <Input
        value={firstName}
        setValue={setFirstName}
        label="First Name"
        placeholder="First Name"
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={lastName}
        setValue={setLastName}
        label="Last name"
        placeholder="Last name"
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={companyName}
        setValue={setCompanyName}
        label="business Name"
        placeholder="business Name"
        Icon={WorkOutlineOutlined}
      />
      <Input
        value={phoneNumber}
        setValue={setPhoneNumber}
        label="Phone Number"
        placeholder="Phone Number"
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        msgError={stateAuth.isError ? stateAuth.error.phoneNumberError : ""}
      />
      <Input
        value={email}
        setValue={setEmail}
        label="Email"
        placeholder="Email"
        msgError={isPress && msgError.email(email)}
        Icon={EmailOutlined}
      />
      <Input
        value={password}
        setValue={setPassword}
        label="Password"
        placeholder="Password"
        type="password"
        msgError={isPress && msgError.password(password)}
        Icon={LockOutlined}
      />
      <Input
        value={rePassword}
        setValue={setRePassword}
        label="Repeat Password"
        placeholder="Repeat Password"
        type="password"
        msgError={isPress && msgError.rePassword(rePassword, password)}
        Icon={LockOutlined}
      />
      <Button
        label="Signup"
        disabled={
          !(
            password &&
            rePassword &&
            companyName &&
            email &&
            phoneNumber &&
            firstName &&
            lastName
          )
        }
        onClick={() => {
          setIsPress(true);
          !(
            msgError.email(email) ||
            msgError.password(password) ||
            msgError.rePassword(rePassword, password) ||
            stateAuth.isError
          ) &&
            dispatch(
              createUserLoading(
                firstName,
                lastName,
                companyName,
                country,
                callingCode,
                phoneNumber,
                email,
                password,
                navigate
              )
            );
        }}
        isLoading={stateAuth.isLoading}
      />
    </>
  );
};
