import React, { useEffect, useState } from "react";
import Input from "../components/input";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import msgError from "../utils/msgError";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { PersonOutlineOutlined, EmailOutlined } from "@mui/icons-material";
import { phoneNumberCheck } from "../features/auth/action";
import { editUsers } from "../features/users/action";

const PersonalInformation = ({ userCurrent, setUserCurrentPhone }) => {
  const [errorPhone, setErrorPhone] = useState(null);
  const [firstName, setFirstName] = useState(userCurrent.first_name);
  const [lastName, setLastName] = useState(userCurrent.last_name);
  const [email, setEmail] = useState(userCurrent.email);
  const [phoneNumber, setPhoneNumber] = useState(userCurrent.phone_number);
  const [country, setCountry] = useState(userCurrent.calling_code.slice(0, 2));
  const [callingCode, setCallingCode] = useState(
    userCurrent.calling_code.slice(2)
  );
  const [isEdit, setIsEdit] = useState(false);
  const [openSnackbar] = useSnackbar();
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { isLoading } = useSelector((state) => state.users);
  const { error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // check phoneNumber realtime
    phoneNumber !== userCurrent.phone_number &&
      dispatch(phoneNumberCheck(phoneNumber));

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
    const canSave = !msgError.email(email) && !errorPhone;
    canSave &&
      dispatch(
        editUsers({
          first_name: firstName,
          last_name: lastName,
          email: email,
          callingCode: callingCode,
          country: country,
          old_phone_number: userCurrent.phone_number,
          new_phone_number: phoneNumber,
        })
      )
        .unwrap()
        .then((res) => {
          userCurrent.phone_number !== phoneNumber &&
            setUserCurrentPhone(phoneNumber);
          setIsEdit(false);
        })
        .catch((error) => {
          openSnackbar(
            error.code === "ERR_NETWORK"
              ? Translate("connectionFailed", language)
              : error.message
          );
        });
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

  const className = {
    title: `main-title text-${I18nManager.isRTL ? "right" : "left"}`,
    btn: `container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`,
  };

  return (
    <div className="section-container">
      <div className={className.title}>
        {Translate("personalInformation", language)}
      </div>
      <Input
        value={firstName}
        setValue={setFirstName}
        label={Translate("firstName", language)}
        placeholder={Translate("firstName", language)}
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={lastName}
        setValue={setLastName}
        label={Translate("lastName", language)}
        placeholder={Translate("lastName", language)}
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={email}
        setValue={setEmail}
        label={Translate("email", language)}
        placeholder={Translate("email", language)}
        Icon={EmailOutlined}
        msgError={isEdit && Translate(msgError.email(email), language)}
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
        msgError={
          errorPhone === "phoneNumberExists"
            ? Translate("phoneNumberExists", language)
            : errorPhone
        }
      />
      {isEdit && (
        <div className={className.btn}>
          <Button
            label={Translate("ok", language)}
            customStyle={{ width: "40%" }}
            isLoading={isLoading}
            onClick={handelClickEditInfo}
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
