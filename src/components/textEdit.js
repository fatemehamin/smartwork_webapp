import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { dailyReport } from "../redux/action/employeeAction";
import jMoment from "moment-jalaali";
import { Input, InputAdornment } from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import "./textEdit.css";

export default ({ report, jDate }) => {
  const pad = (n) => (n < 10 ? "0" + n : n);
  const Date = jMoment(
    `${jDate.slice(0, 4)}/${jDate.slice(5, 7)}/${jDate.slice(8, 10)}`,
    "jYYYY/jM/jD"
  );
  const date = `${Date.year()}-${pad(Date.month() + 1)}-${pad(Date.date())}`;
  const [isEdit, setIsEdit] = useState(false);
  const [notSave, setNotSave] = useState(false);
  const [DReport, setDReport] = useState(report);
  useEffect(() => {
    setDReport(report);
  }, [report]);
  const dispatch = useDispatch();
  return (
    <div className={`TE_container ${notSave && "TE_notSave"}`}>
      {isEdit ? (
        <>
          <Input
            multiline
            disableUnderline
            className="TE_textReportDefault TE_textReportEditable"
            defaultValue={DReport}
            onChange={(e) => setDReport(e.target.value)}
            inputProps={{
              onBlur: () =>
                report == DReport
                  ? (setIsEdit(false), setNotSave(false))
                  : setNotSave(true),
            }}
            endAdornment={
              <InputAdornment position="end">
                <Check
                  className="TE_dailyReportEdit"
                  onClick={() => {
                    dispatch(
                      dailyReport(date, DReport, setIsEdit, !isEdit, jDate)
                    );
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
            }
          />
        </>
      ) : (
        <p
          className="TE_textReportDefault TE_textReportNotEditable"
          onClick={() => setIsEdit(!isEdit)}
        >
          Daily Report : {DReport}
        </p>
      )}
    </div>
  );
};
