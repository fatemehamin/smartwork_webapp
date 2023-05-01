import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import msgError from "../utils/msgError";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../i18n";
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

const Signup = () => {
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
  const { language } = useSelector((state) => state.configReducer);

  useEffect(() => {
    stateAuth.isError &&
      stateAuth.error.existsCompanyError != undefined &&
      openSnackbar(stateAuth.error.existsCompanyError);
    // check phoneNumber realtime
    callingCode != phoneNumber && dispatch(phoneNumberCheck(phoneNumber));
  }, [phoneNumber, stateAuth.isError]);

  const disableSignup = !(
    password &&
    rePassword &&
    companyName &&
    email &&
    phoneNumber &&
    firstName &&
    lastName
  );

  const onSignupHandler = () => {
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
  };

  return (
    <>
      <AppBar label={Translate("signup", language)} type="AUTH" />
      <Input
        value={firstName}
        setValue={setFirstName}
        label={Translate("firstName", language)}
        placeholder={Translate("firstName", language)}
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={lastName}
        setValue={setLastName}
        label={Translate("lastName", language)}
        placeholder={Translate("lastName", language)}
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={companyName}
        setValue={setCompanyName}
        label={Translate("businessName", language)}
        placeholder={Translate("businessName", language)}
        Icon={WorkOutlineOutlined}
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
        msgError={stateAuth.isError ? stateAuth.error.phoneNumberError : ""}
      />
      <Input
        value={email}
        setValue={setEmail}
        label={Translate("email", language)}
        placeholder={Translate("email", language)}
        msgError={isPress && Translate(msgError.email(email), language)}
        Icon={EmailOutlined}
      />
      <Input
        value={password}
        setValue={setPassword}
        label={Translate("password", language)}
        placeholder={Translate("password", language)}
        type="password"
        msgError={isPress && Translate(msgError.password(password), language)}
        Icon={LockOutlined}
      />
      <Input
        value={rePassword}
        setValue={setRePassword}
        label={Translate("repeatPassword", language)}
        placeholder={Translate("repeatPassword", language)}
        type="password"
        msgError={
          isPress &&
          Translate(msgError.rePassword(rePassword, password), language)
        }
        Icon={LockOutlined}
      />
      <Button
        label={Translate("signup", language)}
        disabled={disableSignup}
        onClick={onSignupHandler}
        isLoading={stateAuth.isLoading}
      />
    </>
  );
};
export default Signup;
