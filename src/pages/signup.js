import React, { useState } from "react";
import AppBar from "../components/appBar";
import Input from "../components/input";
import Button from "../components/button";
import msgError from "../utils/msgError";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { createUserLoading, phoneNumberCheck } from "../features/auth/action";
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
  const { language } = useSelector((state) => state.i18n);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // check phoneNumber realtime
    callingCode !== phoneNumber && dispatch(phoneNumberCheck(phoneNumber));
  }, [callingCode, dispatch, phoneNumber]);

  const disableSignup = !(
    password &&
    rePassword &&
    companyName.trim() &&
    phoneNumber !== callingCode &&
    firstName.trim() &&
    lastName.trim()
  );

  const HandleSignup = () => {
    setIsPress(true);
    !(
      msgError.password(password) ||
      msgError.rePassword(rePassword, password) ||
      error
    ) &&
      dispatch(
        createUserLoading({
          firstName,
          lastName,
          companyName,
          country,
          callingCode,
          phoneNumber,
          password,
        })
      )
        .unwrap()
        .then((res) => navigate(`/verifyCode/${phoneNumber}/createUser`))
        .catch((error) =>
          openSnackbar(
            error.code === "ERR_NETWORK"
              ? Translate("connectionFailed", language)
              : error.message.slice(-3) === "406"
              ? Translate("businessNameExists", language)
              : error.message
          )
        );
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
        msgError={
          error === "phoneNumberExists"
            ? Translate("phoneNumberExists", language)
            : error
        }
      />
      <Input
        value={password}
        setValue={setPassword}
        label={Translate("password", language)}
        placeholder={Translate("password", language)}
        type="password"
        Icon={LockOutlined}
        msgError={isPress && Translate(msgError.password(password), language)}
      />
      <Input
        value={rePassword}
        setValue={setRePassword}
        label={Translate("repeatPassword", language)}
        placeholder={Translate("repeatPassword", language)}
        type="password"
        Icon={LockOutlined}
        msgError={
          isPress &&
          Translate(msgError.rePassword(rePassword, password), language)
        }
      />
      <Button
        label={Translate("signup", language)}
        disabled={disableSignup}
        onClick={HandleSignup}
        isLoading={isLoading}
      />
    </>
  );
};
export default Signup;
