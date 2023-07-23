import { createSlice } from "@reduxjs/toolkit";
import {
  changeStatusMsg,
  deleteMsg,
  fetchMsg,
  fetchIsNewMsg,
  sendMsg,
} from "./action";

const initialState = {
  msg: [],
  isNewMsg: false,
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
    builder.addCase(changeStatusMsg.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(changeStatusMsg.fulfilled, (state, action) => {
      const { id, status } = action.payload;
      state.isLoading = false;
      state.msg = state.msg.map((m) => (m.id === id ? { ...m, status } : m));
    });
    builder.addCase(changeStatusMsg.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchIsNewMsg.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchIsNewMsg.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isNewMsg = action.payload;
    });
    builder.addCase(fetchIsNewMsg.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default msgSlice.reducer;
