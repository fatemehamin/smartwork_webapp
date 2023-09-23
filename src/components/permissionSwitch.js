import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { Switch } from "@mui/material";
import { permissionExcelAutoExit } from "../features/users/action";
import { useSnackbar } from "react-simple-snackbar";

const PermissionSwitch = ({
  userCurrent,
  typePermission,
  initCheck,
  label,
  description,
}) => {
  const { language } = useSelector((state) => state.i18n);
  const { isLoading } = useSelector((state) => state.users);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const checked =
    typePermission === "accessExcel"
      ? phoneNumber === userCurrent.phone_number || initCheck
      : initCheck;

  const disabled =
    typePermission === "accessExcel"
      ? phoneNumber === userCurrent.phone_number || isLoading
      : isLoading;

  const handleToggleExcel = () => {
    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    };

    const args = {
      phoneNumber: userCurrent.phone_number,
      typePermission,
      isToggle: !initCheck,
    };

    dispatch(permissionExcelAutoExit(args)).unwrap().catch(_error);
  };

  const className = {
    section: `row_section direction text-align ${
      disabled ? "row_section_disable" : ""
    }`,
  };

  return (
    <div className="section-container">
      <div className="main-title text-align">{Translate(label, language)}</div>
      <div className={className.section}>
        <div>{Translate(description, language)}</div>
        <Switch
          checked={checked}
          disabled={disabled}
          color="secondary"
          onChange={handleToggleExcel}
        />
      </div>
    </div>
  );
};

export default PermissionSwitch;
