import React, { useState, useRef } from "react";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { PersonOutlineOutlined, LockOutlined } from "@mui/icons-material";
import { addUsers } from "../features/users/action";
import Input from "./input";
import Modal from "./modal";
import Button from "./button";
import msgError from "../utils/msgError";

const AddUserModal = ({ modalVisibleUser, setModalVisibleUser }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [callingCode, setCallingCode] = useState("+98");
  const [country, setCountry] = useState("IR");
  const [isPress, setIsPress] = useState(false);

  const { isLoading, error } = useSelector((state) => state.users);
  const { language } = useSelector((state) => state.i18n);
  const [openSnackbar] = useSnackbar();

  const lastNameInputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const rePasswordInputRef = useRef(null);

  const dispatch = useDispatch();
  const closeAddUserModal = () => setModalVisibleUser(false);

  const disabledAddBtn = !(
    password &&
    rePassword &&
    phoneNumber !== callingCode &&
    firstName.trim() &&
    lastName.trim()
  );

  const handleAddUser = () => {
    setIsPress(true);
    const canSave = !(
      msgError.password(password) || msgError.rePassword(rePassword, password)
    );

    const args = {
      firstName,
      lastName,
      password,
      callingCode,
      country,
      phoneNumber,
    };

    const _then = (res) => {
      setIsPress(false);
      setFirstName("");
      setLastName("");
      setPassword("");
      setRePassword("");
      setPhoneNumber("");
      setModalVisibleUser(false);
      openSnackbar(Translate("NewUserAddedSuccessfully", language));
    };

    const _error = (error) => {
      error.message.slice(-3) !== "409" &&
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
    };

    canSave && dispatch(addUsers(args)).unwrap().then(_then).catch(_error);
  };

  const onKeyDownFirstName = (e) => {
    if (e.keyCode === 13) {
      lastNameInputRef.current.focus();
    }
  };
  const onKeyDownLastName = (e) => {
    if (e.keyCode === 13) {
      phoneInputRef.current.focus();
    }
  };
  const onKeyDownPhone = (e) => {
    if (e.keyCode === 13) {
      passwordInputRef.current.focus();
    }
  };
  const onKeyDownPassword = (e) => {
    if (e.keyCode === 13) {
      rePasswordInputRef.current.focus();
    }
  };
  const onKeyDownRePassword = (e) => {
    if (e.keyCode === 13 && !disabledAddBtn) {
      handleAddUser();
    }
  };

  return (
    <Modal
      modalVisible={modalVisibleUser}
      setModalVisible={setModalVisibleUser}
      label="userProfile"
    >
      <Input
        label={Translate("firstName", language)}
        placeholder={Translate("firstName", language)}
        Icon={PersonOutlineOutlined}
        value={firstName}
        setValue={setFirstName}
        onKeyDown={onKeyDownFirstName}
        autoFocus
      />
      <Input
        label={Translate("lastName", language)}
        placeholder={Translate("lastName", language)}
        Icon={PersonOutlineOutlined}
        value={lastName}
        setValue={setLastName}
        onKeyDown={onKeyDownLastName}
        ref={lastNameInputRef}
      />
      <Input
        label={Translate("phoneNumber", language)}
        placeholder={Translate("phoneNumber", language)}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        value={phoneNumber}
        setValue={setPhoneNumber}
        country={country}
        setCountry={setCountry}
        onKeyDown={onKeyDownPhone}
        ref={phoneInputRef}
        msgError={
          error === "phoneNumberExists"
            ? Translate("phoneNumberExists", language)
            : error
        }
      />
      <Input
        label={Translate("password", language)}
        placeholder={Translate("password", language)}
        Icon={LockOutlined}
        type="password"
        value={password}
        setValue={setPassword}
        onKeyDown={onKeyDownPassword}
        ref={passwordInputRef}
        msgError={isPress && Translate(msgError.password(password), language)}
      />
      <Input
        label={Translate("repeatPassword", language)}
        placeholder={Translate("repeatPassword", language)}
        Icon={LockOutlined}
        type="password"
        value={rePassword}
        setValue={setRePassword}
        onKeyDown={onKeyDownRePassword}
        ref={rePasswordInputRef}
        msgError={
          isPress &&
          Translate(msgError.rePassword(rePassword, password), language)
        }
      />
      <div className="container_btn_row direction">
        <Button
          label={Translate("add", language)}
          customStyle={{ width: "40%" }}
          isLoading={isLoading}
          disabled={disabledAddBtn}
          onClick={handleAddUser}
        />
        <Button
          label={Translate("cancel", language)}
          customStyle={{ width: "40%" }}
          onClick={closeAddUserModal}
          type="SECONDARY"
        />
      </div>
    </Modal>
  );
};

export default AddUserModal;
