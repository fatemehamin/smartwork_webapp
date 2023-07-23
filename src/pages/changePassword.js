import React, { useState } from "react";
import { LockOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { changePassword } from "../features/auth/action";
import { Translate } from "../features/i18n/translate";
import AppBar from "../components/appBar";
import Input from "../components/input";
import Button from "../components/button";
import msgError from "../utils/msgError";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPress, setIsPress] = useState(false);
  const [openSnackbar] = useSnackbar();
  const stateAuth = useSelector((state) => state.auth);
  const { language } = useSelector((state) => state.i18n);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const HandleChangePass = () => {
    const canSave = !(
      msgError.rePassword(rePassword, password) || msgError.password(password)
    );

    const _error = (error) =>
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );

    const args = { username: stateAuth.userInfo.phoneNumber, password };

    setIsPress(true);
    canSave &&
      dispatch(changePassword(args))
        .unwrap()
        .then((res) => navigate("/login"))
        .catch(_error);
  };

  return (
    <>
      <AppBar label="changePassword" type="back" />
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
        label={Translate("changePassword", language)}
        disabled={!(password && rePassword)}
        onClick={HandleChangePass}
        isLoading={stateAuth.isLoading}
      />
    </>
  );
};

export default ChangePassword;
