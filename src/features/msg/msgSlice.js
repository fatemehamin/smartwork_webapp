import { createSlice } from "@reduxjs/toolkit";
import {
  changeStatusMsg,
  deleteMsg,
  fetchMsg,
  sendMsg,
  fetchNewMsg,
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
  reducers: {
    UpdateIsNewMsg: (state, action) => {
      state.isNewMsg = action.payload;
    },
  },
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
    builder.addCase(fetchNewMsg.fulfilled, (state, action) => {
      const { msg, type } = action.payload;
      if (type === "REQUEST_ANSWER") {
        state.msg = state.msg.map((m) => (m.id === msg.id ? msg : m));
        state.isNewMsg = true;
      } else {
        state.msg.push(msg);
        state.isNewMsg = !msg.seen;
      }
    });
  },
});

export const { UpdateIsNewMsg } = msgSlice.actions;
export default msgSlice.reducer;
