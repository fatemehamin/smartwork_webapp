import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import jMoment from "moment-jalaali";
import { Input, InputAdornment } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { Translate } from "../features/i18n/translate";
import { setDailyReport } from "../features/reports/action";
import "./textEdit.css";

const TextEdit = ({ report, jDate }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [notSave, setNotSave] = useState(false);
  const [DReport, setDReport] = useState(report);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const Date = jMoment(
    `${jDate.slice(0, 4)}/${jDate.slice(5, 7)}/${jDate.slice(8, 10)}`,
    "jYYYY/jM/jD"
  );

  useEffect(() => {
    setDReport(report);
  }, [report]);

  const pad = (n) => (n < 10 ? "0" + n : n);
  const date = `${Date.year()}-${pad(Date.month() + 1)}-${pad(Date.date())}`;
  const toggleEdit = () => setIsEdit((isEdit) => !isEdit);
  const handleChange = (e) => setDReport(e.target.value);

  const onBlurHandler = () => {
    return report === DReport
      ? (setIsEdit(false), setNotSave(false))
      : setNotSave(true);
  };

  const handleCheck = () => {
    dispatch(setDailyReport({ date, dailyReport: DReport, jDate }))
      .unwrap()
      .then(() => setIsEdit(false))
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
    setNotSave(false);
  };

  const handleClose = () => {
    setDReport(report);
    setIsEdit(!isEdit);
    setNotSave(false);
  };

  const endAdornment = (
    <InputAdornment position="end">
      <Check className="TE_dailyReportEdit" onClick={handleCheck} />
      <Close className="TE_dailyReportEdit" onClick={handleClose} />
    </InputAdornment>
  );

  const className = {
    container: `TE_container ${notSave ? "TE_notSave" : ""} ${
      I18nManager.isRTL ? "rtl" : "ltr"
    }`,
    input: `TE_textReportDefault TE_textReportEditable text-${
      I18nManager.isRTL ? "right" : "left"
    }`,
    text: `TE_textReportDefault text-${I18nManager.isRTL ? "right" : "left"} ${
      DReport ? "TE_textReportNotEditable" : "TE_textNoReport"
    }`,
  };

  return (
    <div className={className.container}>
      {isEdit ? (
        <>
          <Input
            multiline
            disableUnderline
            className={className.input}
            defaultValue={DReport}
            onChange={handleChange}
            inputProps={{ onBlur: onBlurHandler }}
            endAdornment={endAdornment}
            autoFocus
          />
        </>
      ) : (
        <p className={className.text} onClick={toggleEdit}>
          {DReport ? DReport : Translate("dailyReport", language) + " ..."}
        </p>
      )}
    </div>
  );
};

export default TextEdit;
