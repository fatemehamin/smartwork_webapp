import React from "react";
import * as XLSX from "xlsx";
import Excel from "../assets/icons/excel.svg";
import { useSelector } from "react-redux";
import { FileDownload } from "@mui/icons-material";
import "./excelFile.css";

const ExcelFile = ({ dataExcel, jYear, jMonth, fullName }) => {
  const { I18nManager } = useSelector((state) => state.i18n);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const nowTime = new Date().getTime();
  const fileName = `${fullName}_${jYear}${pad(jMonth)}_${nowTime}`;

  const exportFile = () => {
    const wb = XLSX.utils.book_new();
    let ws = XLSX.utils.aoa_to_sheet(dataExcel.data);

    //Create workbook and set Views if workbook is not already defined
    if (!wb.Workbook) {
      wb.Workbook = {};
    }

    wb.Workbook.Views = [{ RTL: I18nManager.isRTL }];

    ws["!cols"] = dataExcel.hiddenColumn;
    ws["!merges"] = dataExcel.config;

    XLSX.utils.book_append_sheet(wb, ws, fullName);
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  return (
    <div className="excel-file">
      <img src={Excel} className="excel-icon" alt="excel" />
      <div className="excel-modal-text excel-one-line">{fileName}.xlsx</div>
      <span onClick={exportFile} className="excel-icon-download">
        <FileDownload />
      </span>
    </div>
  );
};

export default ExcelFile;
