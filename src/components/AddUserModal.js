import React, { useState } from "react";
import Input from "./input";
import Modal from "./modal";
import Button from "./button";
import msgError from "../utils/msgError";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { PersonOutlineOutlined, LockOutlined } from "@mui/icons-material";
import { addUsers } from "../features/users/action";

const AddUserModal = ({ modalVisibleUser, setModalVisibleUser }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("+98");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [callingCode, setCallingCode] = useState("+98");
  const [country, setCountry] = useState("IR");
  const [isPress, setIsPress] = useState(false);
  const [openSnackbar] = useSnackbar();
  const { isLoading, error } = useSelector((state) => state.users);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const dispatch = useDispatch();

  const disabledAddBtn = !(
    password &&
    rePassword &&
    phoneNumber !== callingCode &&
    firstName.trim() &&
    lastName.trim()
  );

  const closeAddUserModal = () => setModalVisibleUser(false);

  const handleAddUser = () => {
    setIsPress(true);
    const canSave = !(
      msgError.password(password) || msgError.rePassword(rePassword, password)
    );

    canSave &&
      dispatch(
        addUsers({
          firstName,
          lastName,
          password,
          callingCode,
          country,
          phoneNumber,
        })
      )
        .unwrap()
        .then((res) => {
          setIsPress(false);
          setFirstName("");
          setLastName("");
          setPassword("");
          setRePassword("");
          setPhoneNumber("");
          setModalVisibleUser(false);
          openSnackbar(Translate("NewUserAddedSuccessfully", language));
        })
        .catch((error) => {
          error.message.slice(-3) !== "409" &&
            openSnackbar(
              error.code === "ERR_NETWORK"
                ? Translate("connectionFailed", language)
                : error.message
            );
        });
  };

  return (
    <Modal
      modalVisible={modalVisibleUser}
      setModalVisible={setModalVisibleUser}
    >
      <h2 className="text-center">{Translate("userProfile", language)}</h2>
      <Input
        label={Translate("firstName", language)}
        placeholder={Translate("firstName", language)}
        Icon={PersonOutlineOutlined}
        value={firstName}
        setValue={setFirstName}
      />
      <Input
        label={Translate("lastName", language)}
        placeholder={Translate("lastName", language)}
        Icon={PersonOutlineOutlined}
        value={lastName}
        setValue={setLastName}
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
        value={password}
        setValue={setPassword}
        type="password"
        msgError={isPress && Translate(msgError.password(password), language)}
      />
      <Input
        label={Translate("repeatPassword", language)}
        placeholder={Translate("repeatPassword", language)}
        Icon={LockOutlined}
        type="password"
        value={rePassword}
        setValue={setRePassword}
        msgError={
          isPress &&
          Translate(msgError.rePassword(rePassword, password), language)
        }
      />
      <div className={`container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`}>
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
