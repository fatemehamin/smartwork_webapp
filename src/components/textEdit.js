import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dailyReport } from "../redux/action/employeeAction";
import jMoment from "moment-jalaali";
import { Input, InputAdornment } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import { Translate } from "../i18n";
import "./textEdit.css";

const TextEdit = ({ report, jDate }) => {
  const pad = (n) => (n < 10 ? "0" + n : n);
  const Date = jMoment(
    `${jDate.slice(0, 4)}/${jDate.slice(5, 7)}/${jDate.slice(8, 10)}`,
    "jYYYY/jM/jD"
  );
  const date = `${Date.year()}-${pad(Date.month() + 1)}-${pad(Date.date())}`;
  const [isEdit, setIsEdit] = useState(false);
  const [notSave, setNotSave] = useState(false);
  const [DReport, setDReport] = useState(report);
  const dispatch = useDispatch();
  const { language, I18nManager } = useSelector((state) => state.configReducer);

  useEffect(() => {
    setDReport(report);
  }, [report]);

  const onBlurHandler = () => {
    return report == DReport
      ? (setIsEdit(false), setNotSave(false))
      : setNotSave(true);
  };

  const endAdornment = (
    <InputAdornment position="end">
      <Check
        className="TE_dailyReportEdit"
        onClick={() => {
          dispatch(dailyReport(date, DReport, setIsEdit, !isEdit, jDate));
          setNotSave(false);
        }}
      />
      <Close
        className="TE_dailyReportEdit"
        onClick={() => {
          setDReport(report);
          setIsEdit(!isEdit);
          setNotSave(false);
        }}
      />
    </InputAdornment>
  );

  return (
    <div
      style={styles(I18nManager.isRTL).direction}
      className={`TE_container ${notSave && "TE_notSave"}`}
    >
      {isEdit ? (
        <>
          <Input
            multiline
            disableUnderline
            style={styles(I18nManager.isRTL).textAlign}
            className="TE_textReportDefault TE_textReportEditable"
            defaultValue={DReport}
            onChange={(e) => setDReport(e.target.value)}
            inputProps={{ onBlur: onBlurHandler }}
            endAdornment={endAdornment}
          />
        </>
      ) : (
        <p
          className="TE_textReportDefault TE_textReportNotEditable"
          style={styles(I18nManager.isRTL).textAlign}
          onClick={() => setIsEdit(!isEdit)}
        >
          {Translate("dailyReport", language)} : {DReport}
        </p>
      )}
    </div>
  );
};

const styles = (isRTL) => ({
  direction: { direction: isRTL ? "rtl" : "ltr" },
  textAlign: { textAlign: isRTL ? "right" : "left" },
});

export default TextEdit;
