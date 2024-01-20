import { createSlice } from "@reduxjs/toolkit";
import {
  fetchLeaveRequests,
  addLeaveRequests,
  deleteLeave,
  changeStatusLeave,
  fetchNewLeaveRequests,
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
  reducers: {
    UpdateIsNewLeave: (state, action) => {
      state.isNewLeave = action.payload;
    },
    DeleteLeave: (state, action) => {
      state.leaveRequests = state.leaveRequests.filter(
        (l) => l.id != action.payload
      );
    },
  },
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
    builder.addCase(fetchNewLeaveRequests.fulfilled, (state, action) => {
      const { leaveList, type } = action.payload;
      if (type === "REQUEST_ANSWER") {
        state.leaveRequests = state.leaveRequests.map((l) =>
          l.id === leaveList.id ? leaveList : l
        );
        state.isNewLeave = true;
      } else {
        const isExistLeave = state.leaveRequests.find(
          (l) => l.id === leaveList.id
        );
        if (!isExistLeave) {
          state.leaveRequests.push(leaveList);
          state.isNewLeave = !leaveList.seen;
        }
      }
    });
  },
});

export const { UpdateIsNewLeave, DeleteLeave } = leaveRequestsSlice.actions;
export default leaveRequestsSlice.reducer;
