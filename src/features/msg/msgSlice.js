import { createSlice } from "@reduxjs/toolkit";
import { changeStatus, deleteMsg, fetchMsg, sendMsg } from "./action";

const initialState = {
  msg: [],
  isLoading: false,
  error: null,
};

const msgSlice = createSlice({
  name: "msg",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchMsg.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchMsg.fulfilled, (state, action) => {
      state.isLoading = false;
      state.msg = action.payload;
    });
    builder.addCase(fetchMsg.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(sendMsg.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(sendMsg.fulfilled, (state, action) => {
      state.isLoading = false;
      state.msg.push(action.payload);
    });
    builder.addCase(sendMsg.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteMsg.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteMsg.fulfilled, (state, action) => {
      state.isLoading = false;
      state.msg = state.msg.filter((m) => m.id !== action.payload);
    });
    builder.addCase(deleteMsg.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(changeStatus.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeStatus.fulfilled, (state, action) => {
      const { id, status } = action.payload;
      state.isLoading = false;
      state.msg = state.msg.map((m) => (m.id === id ? { ...m, status } : m));
    });
    builder.addCase(changeStatus.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default msgSlice.reducer;
