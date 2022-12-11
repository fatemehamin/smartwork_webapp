import React, { useState } from "react";
import AppBar from "../components/AppBar";
import Input from "../components/Input";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState("IR");
  const [callingCode, setCallingCode] = useState("+98");
  // const state = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  return (
    <>
      <AppBar label="Forgot password" type="back" />
      <p style={styles.text}>
        Please enter your phone number to recover your password.
      </p>
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
      <Button
        label="Verify code"
        disabled={phoneNumber == ""}
        onClick={() => {
          console.log("Verify code");
          navigate(`/verifyCode/${phoneNumber}/type`);
          // dispatch(forgotPassword(callingCode + phoneNumber, navigation));
        }}
        // isLoading={state.isLoading}
      />
    </>
  );
};
const styles = {
  text: {
    marginLeft: "10%",
    marginBottom: 30,
    textAlign: "left",
  },
};
