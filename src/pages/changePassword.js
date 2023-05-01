import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { LockOutlined } from "@mui/icons-material";
import msgError from "../utils/msgError";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { changePassword } from "../redux/action/authAction";
import { useEffect } from "react";
import { Translate } from "../i18n";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPress, setIsPress] = useState(false);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const stateAuth = useSelector((state) => state.authReducer);
  const { language } = useSelector((state) => state.configReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    stateAuth.isError && openSnackbar(stateAuth.error);
  }, [stateAuth.isError]);

  const onChangePassHandler = () => {
    setIsPress(true);
    !(
      msgError.rePassword(rePassword, password) || msgError.password(password)
    ) && dispatch(changePassword(stateAuth.user.username, password, navigate));
  };

  return (
    <>
      <AppBar label={Translate("changePassword", language)} type="back" />
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
        label={Translate("changePassword", language)}
        disabled={!(password && rePassword)}
        onClick={onChangePassHandler}
        isLoading={stateAuth.isLoading}
      />
    </>
  );
};

export default ChangePassword;
