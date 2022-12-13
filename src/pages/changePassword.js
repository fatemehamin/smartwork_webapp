import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { LockOutlined } from "@mui/icons-material";
import msgError from "../utils/msgError";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "react-simple-snackbar";
import { ChangePassword } from "../redux/action/authAction";
import { useEffect } from "react";

export default () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPress, setIsPress] = useState(false);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const stateAuth = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    stateAuth.isError && openSnackbar(stateAuth.error);
  }, [stateAuth.isError]);

  return (
    <>
      <AppBar label="Change password" type="back" />
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
        label="Change Password"
        disabled={!(password && rePassword)}
        onClick={() => {
          console.log("Change Password");
          setIsPress(true);
          !(
            msgError.rePassword(rePassword, password) ||
            msgError.password(password)
          ) &&
            dispatch(
              ChangePassword(stateAuth.user.username, password, navigate)
            );
        }}
        isLoading={stateAuth.isLoading}
      />
    </>
  );
};
