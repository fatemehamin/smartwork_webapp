import React, { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { EmailOutlined, PersonOutlineRounded } from "@mui/icons-material";
import { phoneNumberCheck } from "../features/auth/action";
import { addImageUser, editUsers } from "../features/users/action";
import { updateUser } from "../features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../components/input";
import msgError from "../utils/msgError";
import UploadProfile from "../components/uploadProfile";
import AppBar from "../components/appBar";
import "./profileSetting.css";

const EditProfile = () => {
  const { id } = useParams();

  const { language } = useSelector((state) => state.i18n);
  const { error, userInfo } = useSelector((state) => state.auth);
  const { isLoading, users, profileUsers } = useSelector(
    (state) => state.users
  );

  const user = useMemo(() => users.find((user) => user.id == id), [id, users]);

  const profileUser = useMemo(
    () => profileUsers.find((p) => p.id == id)?.profile,
    [profileUsers, id]
  );

  const [profile, setProfile] = useState({ base64: profileUser, file: null });
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number);
  const [country, setCountry] = useState(user.calling_code.slice(0, 2));
  const [callingCode, setCallingCode] = useState(user.calling_code.slice(2));
  const [errorPhone, setErrorPhone] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const dispatch = useDispatch();
  const navigator = useNavigate();
  const [openSnackbar] = useSnackbar();

  const lastNameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const phoneInputRef = useRef(null);

  const disableEdit = !(
    firstName.trim() &&
    lastName.trim() &&
    phoneNumber.trim() &&
    errorPhone === null &&
    (!email || !msgError.email(email)) &&
    !isLoading
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (phoneNumber !== user.phone_number) {
      // check phoneNumber realtime
      dispatch(phoneNumberCheck(phoneNumber))
        .unwrap()
        .then(() => setErrorPhone(null));

      if (error != null) {
        setErrorPhone(error);
      }
    }
  }, [phoneNumber, error]);

  useEffect(() => {
    setIsEdit(
      firstName !== user.first_name ||
        lastName !== user.last_name ||
        email !== user.email ||
        phoneNumber !== user.phone_number ||
        country + callingCode !== user.calling_code
    );
  }, [firstName, lastName, email, phoneNumber, callingCode]);

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

  const handelSave = () => {
    if (!disableEdit) {
      const args = {
        first_name: firstName,
        last_name: lastName,
        email,
        callingCode,
        country,
        old_phone_number: user.phone_number,
        new_phone_number: phoneNumber,
      };

      const _then = (res) => {
        const isYou = userInfo.phoneNumber === user.phone_number;
        const isEditProfile = !!profile.file;

        if (isEditProfile) {
          const args = {
            base64Profile: profile.base64,
            profile: profile.file,
            fileName: profile.file.name,
            id: parseInt(id),
          };

          dispatch(addImageUser(args)).then((res) => navigator(-1));
        } else {
          navigator(-1);
        }

        if (isYou) {
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
    }
  };

  return (
    <>
      <AppBar
        label="editProfile"
        type="back"
        RightHeader={() =>
          (isEdit || !!profile.file) && (
            <div onClick={handelSave}>
              <p className={disableEdit ? "saveDisable" : ""}>
                {Translate("save", language)}
              </p>
            </div>
          )
        }
      />

      <div className="edit-profile-container">
        <UploadProfile setImg={setProfile} img={profile.base64} />

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
            msgError={email && Translate(msgError.email(email), language)}
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
            disabled
            msgError={
              errorPhone === "phoneNumberExists"
                ? Translate("phoneNumberExists", language)
                : errorPhone
            }
          />
        </div>
      </div>
    </>
  );
};

export default EditProfile;
