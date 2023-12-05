import { createSlice } from "@reduxjs/toolkit";
import {
  addShiftWork,
  deleteShiftWork,
  fetchShiftWork,
  updateShiftWork,
} from "./action";

const initialState = {
  shift: [],
  currentShift: { id: null, name: "", over_time_holiday: false, shiftDay: [] },
  weeksOfDays: [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ],
  isLoading: false,
  error: null,
};

const shiftWorkSlice = createSlice({
  name: "shiftWork",
  initialState,
  reducers: {
    updateCurrentShift: (state, action) => {
      state.currentShift = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchShiftWork.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchShiftWork.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shift = action.payload;
    });
    builder.addCase(fetchShiftWork.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteShiftWork.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteShiftWork.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shift = state.shift.filter((s) => s.id !== action.payload);
    });
    builder.addCase(deleteShiftWork.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addShiftWork.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addShiftWork.fulfilled, (state, action) => {
      console.log(action.payload);
      state.isLoading = false;
      state.shift.push(action.payload);
    });
    builder.addCase(addShiftWork.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateShiftWork.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateShiftWork.fulfilled, (state, action) => {
      state.isLoading = false;
      state.shift = state.shift.map((shift) =>
        action.payload.id === shift.id ? action.payload : shift
      );
    });
    builder.addCase(updateShiftWork.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { updateCurrentShift } = shiftWorkSlice.actions;
export default shiftWorkSlice.reducer;
