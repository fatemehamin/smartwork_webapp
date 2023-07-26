import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { Switch } from "@mui/material";
import { accessExcel } from "../features/users/action";
import { useSnackbar } from "react-simple-snackbar";

const AccessExcel = ({ userCurrent }) => {
  const [isChecked, setIsChecked] = useState(userCurrent.financial_group);
  const { language } = useSelector((state) => state.i18n);
  const { isLoading } = useSelector((state) => state.users);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const handleToggleExcel = (e) => {
    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    };

    const args = {
      phoneNumber: userCurrent.phone_number,
      toggleExcel: !isChecked,
    };

    dispatch(accessExcel(args))
      .unwrap()
      .then(() => setIsChecked(!isChecked))
      .catch(_error);
  };

  return (
    <div className="section-container">
      <div className="main-title text-align">
        {Translate("excel", language)}
      </div>
      <div className="row_section direction">
        <div>{Translate("accessExcel", language)}</div>
        <Switch
          checked={phoneNumber === userCurrent.phone_number || isChecked}
          disabled={phoneNumber === userCurrent.phone_number || isLoading}
          color="secondary"
          onChange={handleToggleExcel}
        />
      </div>
    </div>
  );
};

export default AccessExcel;
