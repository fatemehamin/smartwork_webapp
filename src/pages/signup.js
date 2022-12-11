import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import msgError from "../utils/msgError";
import {
  PersonOutlineOutlined,
  WorkOutlineOutlined,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
export default () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [isPress, setIsPress] = useState(false);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  // const state = useSelector(state => state.authReducer);
  // const ref_LnameInput = useRef();
  // const ref_companyInput = useRef();
  // const ref_phoneInput = useRef();
  // const ref_emailInput = useRef();
  // const ref_passwordInput = useRef();
  // const ref_rePasswordInput = useRef();
  // useEffect(() => {
  //   //check phoneNumber realtime
  //   dispatch(phoneNumberCheck(callingCode + phoneNumber));
  // }, [phoneNumber]);
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
        className="input"
        label="Phone Number"
        placeholder="Phone Number"
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        // returnKeyType="next"
        // keyboardType="numeric"
        // inputRef={(el) => (ref_input2.current = el)}
        // onSubmitEditing={() => ref_input2.current.focus()}
        // msgError={state.isError ? state.error.phoneNumberError : ''}
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
          console.log("Signup");
          setIsPress(true);
          //   !(
          //     msgError.email(email) ||
          //     msgError.password(password) ||
          //     msgError.rePassword(rePassword, password) ||
          //     state.isError
          //   ) &&
          //     dispatch(
          //       createUserLoading(
          //         firstName,
          //         lastName,
          //         companyName,
          //         country,
          //         callingCode,
          //         callingCode + phoneNumber,
          //         email,
          //         password,
          //         navigation,
          //       ),
          //     );
        }}

        // isLoading={state.isLoading}
      />
    </>
  );
};
