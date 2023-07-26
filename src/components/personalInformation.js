import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { PersonOutlineOutlined, EmailOutlined } from "@mui/icons-material";
import { phoneNumberCheck } from "../features/auth/action";
import { editUsers } from "../features/users/action";
import Input from "../components/input";
import Button from "../components/button";
import msgError from "../utils/msgError";
import { updateUser } from "../features/auth/authSlice";

const PersonalInformation = ({ userCurrent }) => {
  const [errorPhone, setErrorPhone] = useState(null);
  const [firstName, setFirstName] = useState(userCurrent.first_name);
  const [lastName, setLastName] = useState(userCurrent.last_name);
  const [email, setEmail] = useState(userCurrent.email);
  const [phoneNumber, setPhoneNumber] = useState(userCurrent.phone_number);
  const [country, setCountry] = useState(userCurrent.calling_code.slice(0, 2));
  const [isEdit, setIsEdit] = useState(false);
  const [callingCode, setCallingCode] = useState(
    userCurrent.calling_code.slice(2)
  );
  const [openSnackbar] = useSnackbar();
  const { language } = useSelector((state) => state.i18n);
  const { isLoading } = useSelector((state) => state.users);
  const { error, userInfo } = useSelector((state) => state.auth);
  const disableEdit = errorPhone || (email && msgError.email(email));
  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // check phoneNumber realtime
    phoneNumber !== userCurrent.phone_number &&
      dispatch(phoneNumberCheck(phoneNumber))
        .unwrap()
        .then(() => setErrorPhone(null));

    error != null &&
      phoneNumber !== userCurrent.phone_number &&
      setErrorPhone(error);

    setIsEdit(
      firstName !== userCurrent.first_name ||
        lastName !== userCurrent.last_name ||
        email !== userCurrent.email ||
        phoneNumber !== userCurrent.phone_number ||
        country + callingCode !== userCurrent.calling_code ||
        errorPhone !== null
    );
  }, [firstName, lastName, email, phoneNumber, callingCode, error]);

  const handelClickEditInfo = () => {
    const args = {
      first_name: firstName,
      last_name: lastName,
      email,
      callingCode,
      country,
      old_phone_number: userCurrent.phone_number,
      new_phone_number: phoneNumber,
    };

    const _then = (res) => {
      if (userInfo.phoneNumber === userCurrent.phone_number) {
        dispatch(
          updateUser({
            country,
            callingCode,
            phoneNumber,
            first_name: firstName,
            last_name: lastName,
            email: email,
          })
        );
      }
      setIsEdit(false);
    };

    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    };

    dispatch(editUsers(args)).unwrap().then(_then).catch(_error);
  };

  const handelClickCancel = () => {
    setIsEdit(false);
    setFirstName(userCurrent.first_name);
    setLastName(userCurrent.last_name);
    setEmail(userCurrent.email);
    setPhoneNumber(userCurrent.phone_number);
    setCountry(userCurrent.calling_code.slice(0, 2));
    setCallingCode(userCurrent.calling_code.slice(2));
    setErrorPhone(null);
  };

  const onKeyDownFirstName = (e) => {
    if (e.keyCode === 13) {
      lastNameInputRef.current.focus();
    }
  };

  const onKeyDownLastName = (e) => {
    if (e.keyCode === 13) {
      emailInputRef.current.focus();
    }
  };

  const onKeyDownEmail = (e) => {
    if (e.keyCode === 13) {
      phoneInputRef.current.focus();
    }
  };

  const onKeyDownPhone = (e) => {
    if (e.keyCode === 13 && isEdit && !disableEdit) {
      handelClickEditInfo();
    }
  };

  return (
    <div className="section-container">
      <div className="main-title text-align">
        {Translate("personalInformation", language)}
      </div>
      <Input
        value={firstName}
        setValue={setFirstName}
        label={Translate("firstName", language)}
        placeholder={Translate("firstName", language)}
        Icon={PersonOutlineOutlined}
        onKeyDown={onKeyDownFirstName}
      />
      <Input
        value={lastName}
        setValue={setLastName}
        label={Translate("lastName", language)}
        placeholder={Translate("lastName", language)}
        Icon={PersonOutlineOutlined}
        ref={lastNameInputRef}
        onKeyDown={onKeyDownLastName}
      />
      <Input
        value={email}
        setValue={setEmail}
        label={Translate("email", language)}
        placeholder={Translate("email", language)}
        Icon={EmailOutlined}
        msgError={isEdit && email && Translate(msgError.email(email), language)}
        ref={emailInputRef}
        onKeyDown={onKeyDownEmail}
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
        ref={phoneInputRef}
        onKeyDown={onKeyDownPhone}
        msgError={
          errorPhone === "phoneNumberExists"
            ? Translate("phoneNumberExists", language)
            : errorPhone
        }
      />
      {isEdit && (
        <div className="container_btn_row direction">
          <Button
            label={Translate("ok", language)}
            customStyle={{ width: "40%" }}
            isLoading={isLoading}
            onClick={handelClickEditInfo}
            disabled={disableEdit}
          />
          <Button
            label={Translate("cancel", language)}
            customStyle={{ width: "40%" }}
            type="SECONDARY"
            onClick={handelClickCancel}
          />
        </div>
      )}
    </div>
  );
};

export default PersonalInformation;
