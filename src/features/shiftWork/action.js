import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchShiftWork = createAsyncThunk(
  "shiftWork/fetchShiftWork",
  async () => {
    const res = await axiosAPI.get("/shift_work/");
    return res.data.shift;
  }
);

export const deleteShiftWork = createAsyncThunk(
  "shiftWork/deleteShiftWork",
  async (id) => {
    await axiosAPI.delete(`/shift_work/${id}/`);
    return id;
  }
);

export const addShiftWork = createAsyncThunk(
  "shiftWork/addShiftWork",
  async ({ shift_day, name, over_time_holiday }) => {
    const res = await axiosAPI.post("/shift_work/", {
      shift_day,
      name,
      over_time_holiday,
    });
    return res.data;
  }
);

export const updateShiftWork = createAsyncThunk(
  "shiftWork/updateShiftWork",
  async ({ id, shift_day, name, over_time_holiday }) => {
    await axiosAPI.put("/shift_work/", {
      id,
      shift_day,
      name,
      over_time_holiday,
    });
    return { id, shiftDay: shift_day, name, over_time_holiday };
  }
);
