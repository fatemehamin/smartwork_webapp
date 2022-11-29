import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { LockOutlined } from "@mui/icons-material";
export default () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPress, setIsPress] = useState(false);
  // const state = useSelector(state => state.authReducer);
  // const dispatch = useDispatch();
  // const navigation = useNavigation();
  // const ref_RePassword = useRef();

  return (
    <>
      <AppBar label="Change password" type="back" />
      <Input
        value={password}
        setValue={setPassword}
        label="Password"
        placeholder="Password"
        type="password"
        // msgError={isPress && msgError.password(password)}
        Icon={LockOutlined}
      />
      <Input
        value={rePassword}
        setValue={setRePassword}
        label="Repeat Password"
        placeholder="Repeat Password"
        type="password"
        // msgError={isPress && msgError.rePassword(rePassword, password)}
        Icon={LockOutlined}
      />
      <Button
        label="Change Password"
        disabled={!(password && rePassword)}
        onClick={() => {
          console.log("Change Password");
          // setIsPress(true);
          // !(
          //   msgError.rePassword(rePassword, password) ||
          //   msgError.password(password)
          // ) &&
          //   dispatch(ChangePassword(state.user.username, password, navigation));
          // Keyboard.dismiss();
        }}

        // isLoading={state.isLoading}
      />
    </>
  );
};
