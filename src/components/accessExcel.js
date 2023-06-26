import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { Switch } from "@mui/material";
import { accessExcel } from "../features/users/action";
import { useSnackbar } from "react-simple-snackbar";

const AccessExcel = ({ userCurrent }) => {
  const [isChecked, setIsChecked] = useState(userCurrent.financial_group);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { isLoading } = useSelector((state) => state.users);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const handleToggleExcel = (e) => {
    dispatch(
      accessExcel({
        phoneNumber: userCurrent.phone_number,
        toggleExcel: !isChecked,
      })
    )
      .unwrap()
      .then(() => setIsChecked(!isChecked))
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  };

  const className = {
    title: `main-title text-${I18nManager.isRTL ? "right" : "left"}`,
    row: `row_section ${I18nManager.isRTL ? "rtl" : "ltr"}`,
  };

  return (
    <div className="section-container">
      <div className={className.title}>{Translate("excel", language)}</div>
      <div className={className.row}>
        <div>{Translate("accessExcel", language)}</div>
        <Switch
          checked={isChecked}
          disabled={isLoading}
          color="secondary"
          onChange={handleToggleExcel}
        />
      </div>
    </div>
  );
};

export default AccessExcel;
