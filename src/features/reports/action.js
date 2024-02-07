import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchDailyReport = createAsyncThunk(
  "reports/fetchDailyReport",
  async (date) => {
    const res = await axiosAPI.put(`/daily_report/`, { date });
    return res.data.dailyReport;
  }
);

export const setDailyReport = createAsyncThunk(
  "reports/setDailyReport",
  async ({ date, dailyReport, jDate }) => {
    await axiosAPI.post(`/daily_report/`, { date, report: dailyReport });
    return { date, dailyReport, jDate };
  }
);

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async ({ jYear, jMonth, daysInMonth, startDate, endDate, phoneNumber }) => {
    const res = await axiosAPI.get(`/export_report/${jYear}/${jMonth}/`);
    const dailyReports = await axiosAPI.get(
      `/daily_report/${phoneNumber}/${startDate}/${endDate}/`
    );

    return {
      reports: res.data.report,
      dailyReports: dailyReports.data["report dictionary : "],
      jYear,
      jMonth,
      daysInMonth,
    };
  }
);

export const exportExcel = createAsyncThunk(
  "reports/exportExcel",
  async ({
    year,
    month,
    daysInMonth,
    startDate,
    endDate,
    phoneNumber,
    filterProject,
  }) => {
    const res = await axiosAPI.post(`/export_report/${year}/${month}/`, {
      employee_username: phoneNumber,
      filter_project: filterProject,
    });
    const dailyReports = await axiosAPI.get(
      `/daily_report/${phoneNumber}/${startDate}/${endDate}/`
    );

    return {
      reports: res.data.report,
      projects: res.data.projects,
      leaves: res.data.leaves,
      delays: res.data.delays,
      overTimes: res.data.overTimes,
      lowTimes: res.data.lowTimes,
      dailyReports: dailyReports.data["report dictionary : "],
      daysInMonth,
      jYear: year,
      jMonth: month,
    };
  }
);
