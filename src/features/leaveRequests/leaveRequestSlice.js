import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLeaveRequests,
  addLeaveRequests,
  deleteLeave,
  changeStatusLeave,
  fetchIsNewLeave,
} from "./action";

const initialState = {
  leaveRequests: [],
  isNewLeave: false,
  isLoading: false,
  error: null,
};

const leaveRequestsSlice = createSlice({
  name: "leaveRequest",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLeaveRequests.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLeaveRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.leaveRequests = action.payload;
    });
    builder.addCase(fetchLeaveRequests.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addLeaveRequests.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addLeaveRequests.fulfilled, (state, action) => {
      state.isLoading = false;
      state.leaveRequests.push(action.payload);
    });
    builder.addCase(addLeaveRequests.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteLeave.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteLeave.fulfilled, (state, action) => {
      state.isLoading = false;
      state.leaveRequests = state.leaveRequests.filter(
        (l) => l.id !== action.payload
      );
    });
    builder.addCase(deleteLeave.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(changeStatusLeave.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeStatusLeave.fulfilled, (state, action) => {
      const { id, status } = action.payload;
      state.isLoading = false;
      state.leaveRequests = state.leaveRequests.map((l) =>
        l.id === id ? { ...l, status } : l
      );
    });
    builder.addCase(changeStatusLeave.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchIsNewLeave.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchIsNewLeave.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isNewLeave = action.payload;
    });
    builder.addCase(fetchIsNewLeave.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default leaveRequestsSlice.reducer;
