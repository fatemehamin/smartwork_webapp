import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { EmailOutlined, PersonOutlineRounded } from "@mui/icons-material";
import { phoneNumberCheck } from "../features/auth/action";
import { editUsers } from "../features/users/action";
import { updateUser } from "../features/auth/authSlice";
import { useParams } from "react-router-dom";
import Input from "../components/input";
import Button from "../components/button";
import msgError from "../utils/msgError";
import UploadProfile from "../components/uploadProfile";
import AppBar from "../components/appBar";
import "./settingEditProfile.css";

const PersonalInformation = () => {
  const { currentId } = useParams();

  const { language } = useSelector((state) => state.i18n);
  const { isLoading, users, profileUsers } = useSelector(
    (state) => state.users
  );
  const { error, userInfo } = useSelector((state) => state.auth);

  const userCurrent = users.filter((user) => user.id == currentId)[0];
  const profileUser = profileUsers.find((p) => p.id == currentId)?.profile;

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

  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const dispatch = useDispatch();

  const disableEdit = !(
    firstName.trim() &&
    lastName.trim() &&
    phoneNumber.trim() &&
    errorPhone === null &&
    (!email || !msgError.email(email)) &&
    isEdit
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        country + callingCode !== userCurrent.calling_code
    );
  }, [firstName, lastName, email, phoneNumber, callingCode, error]);

  const handelEditInfo = () => {
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
    if (e.keyCode === 13 && !disableEdit) {
      handelEditInfo();
    }
  };

  return (
    <>
      <AppBar label={Translate("editProfile", language)} type="back" />
      <div className="edit-profile-container">
        <UploadProfile id={userCurrent.id} img={profileUser} isEdit />

        <div className="edit-profile-form">
          <Input
            value={firstName}
            setValue={setFirstName}
            label={Translate("firstName", language)}
            placeholder={Translate("firstName", language)}
            Icon={PersonOutlineRounded}
            onKeyDown={onKeyDownFirstName}
          />
          <Input
            value={lastName}
            setValue={setLastName}
            label={Translate("lastName", language)}
            placeholder={Translate("lastName", language)}
            Icon={PersonOutlineRounded}
            ref={lastNameInputRef}
            onKeyDown={onKeyDownLastName}
          />
          <Input
            value={email}
            setValue={setEmail}
            label={Translate("email", language)}
            placeholder={Translate("email", language)}
            Icon={EmailOutlined}
            ref={emailInputRef}
            onKeyDown={onKeyDownEmail}
            msgError={
              isEdit && email && Translate(msgError.email(email), language)
            }
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
            disabled
            msgError={
              errorPhone === "phoneNumberExists"
                ? Translate("phoneNumberExists", language)
                : errorPhone
            }
          />

          <Button
            label={Translate("save", language)}
            customStyle={{ margin: "30px 0px" }}
            isLoading={isLoading}
            onClick={handelEditInfo}
            disabled={disableEdit}
          />
        </div>
      </div>
    </>
  );
};

export default PersonalInformation;
