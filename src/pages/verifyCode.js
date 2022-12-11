import React, { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import CodeField from "../components/codeField";
import "./verifyCode.css";

export default () => {
  const { phoneNumber, type } = useParams();
  const [code, setCode] = useState("");
  const [time, setTime] = useState(120);
  const [startTime, setStartTime] = useState(new Date().getTime());
  // const state = useSelector(state => state.authReducer);
  // const navigation = useNavigation();
  // const dispatch = useDispatch();
  useEffect(() => {
    //--------------------- timer--------------------//
    if (time >= 0) {
      const intervalId = setInterval(() => {
        const now = new Date().getTime();
        setTime(() => Math.round((startTime + 120000 - now) / 1000));
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [time]);
  return (
    <>
      <AppBar label="Verification Code" type="back" />
      <div className="Verify_description">
        Please type the verification code sent {"\n"} to {phoneNumber}
      </div>
      <CodeField code={code} setCode={setCode} cellCount={5} />
      <div className="Verify_timer">
        {time >= 0 ? (
          <span style={{ color: "#777" }}>
            Re-send the code in {time} seconds{" "}
          </span>
        ) : (
          <div
            onClick={() => {
              setStartTime(() => new Date().getTime());
              setTime(120);
              // type == 'forgotPassword'
              //   ? dispatch(forgotPassword(state.user.username))
              //   : dispatch(
              //       createUserLoading(
              //         state.user.firstName,
              //         state.user.lastName,
              //         state.user.companyName,
              //         state.user.country,
              //         state.user.callingCode,
              //         state.user.phoneNumber,
              //         state.user.email,
              //         state.user.password,
              //       ),
              //     );
            }}
          >
            <span className="Verify_textTimeout">Re-send code</span>
          </div>
        )}
      </div>
      <Button
        // isLoading={state.isLoading}
        label="Verify"
        // onClick={() => {
        //   dispatch(
        //     verifyCode(
        //       code,
        //       state.user.email,
        //       state.user.firstName,
        //       state.user.lastName,
        //       state.user.companyName,
        //       state.user.password,
        //       state.user.country,
        //       state.user.callingCode,
        //       state.user.phoneNumber,
        //       navigation,
        //       type
        //     )
        //   );
        // }}
        disabled={code.length < 5}
      />
    </>
  );
};
