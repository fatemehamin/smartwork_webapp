import { createSlice } from "@reduxjs/toolkit";
import { changeStatus, deleteMsg, fetchMsg, sendMsg } from "./action";

const initialState = {
  msg: [
    // {
    //   id: 1,
    //   msg: "سلام لطفا امروز بخش فروشگاهی سایت تکمیل گردد.",
    //   from: "+989121234567",
    //   to: "+989101234567",
    //   time: 1688296600633,
    //   project: "SmartWork",
    // },
    // {
    //   id: 2,
    //   msg: "سلام لطفا تسک مدساکو برای من تعریف کنید.",
    //   from: "+989101234567",
    //   to: "+989121234567",
    //   time: 1688296600633,
    //   project: "باکس ایت ول",
    // },
    // {
    //   id: 3,
    //   msg: "Hi, please say hi.",
    //   from: "+989121234567",
    //   to: "+9833109582",
    //   time: new Date().getTime(),
    //   project: "BoxItWell",
    // },
    // {
    //   id: 4,
    //   msg: "Hi, please say hi.",
    //   from: "+989121234567",
    //   to: "+9833109582",
    //   time: new Date().getTime(),
    //   project: "BoxItWell",
    // },
  ],
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
      const { id, from, to, explain, project, date } = action.payload;
      state.isLoading = false;
      // state.msg.push({
      //   id,
      //   from,
      //   to,
      //   msg: explain,
      //   time: date,
      //   project,
      // });
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
