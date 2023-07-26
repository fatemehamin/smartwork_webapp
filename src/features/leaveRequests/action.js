import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchLeaveRequests = createAsyncThunk(
  "leaveRequest/fetchLeaveRequests",
  async () => {
    const res = await axiosAPI.get("/leave/");
    return res.data.leave_list;
  }
);

export const addLeaveRequests = createAsyncThunk(
  "leaveRequest/addLeaveRequests",
  async ({
    type,
    date_leave_from,
    date_leave_to,
    time_leave_from,
    time_leave_to,
    message,
    phone_number,
  }) => {
    const res = await axiosAPI.post("/leave/", {
      type,
      date_leave_from,
      date_leave_to,
      time_leave_from,
      time_leave_to,
      message,
    });
    return {
      type,
      date_leave_from,
      date_leave_to,
      time_leave_from,
      time_leave_to,
      msg: message,
      phone_number,
      ...res.data,
    };
  }
);

export const deleteLeave = createAsyncThunk(
  "leaveRequest/deleteLeave",
  async (id) => {
    await axiosAPI.delete(`/leave/${id}/`);
    return id;
  }
);

export const changeStatusLeave = createAsyncThunk(
  "leaveRequest/changeStatusLeave",
  async ({ id, status }) => {
    await axiosAPI.put(`/leave/${id}/${status}/`);
    return { id, status };
  }
);

export const fetchIsNewLeave = createAsyncThunk(
  "leaveRequest/fetchIsNewLeave",
  async () => {
    const res = await axiosAPI.get("/is_new_leave/");
    return res.data.isNewLeave;
  }
);
