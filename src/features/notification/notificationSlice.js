import { createSlice } from "@reduxjs/toolkit";
import { addFcmToken, deleteFcmToken } from "./action";

const initialState = {
  id: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(addFcmToken.fulfilled, (state, action) => {
      state.id = action.payload;
    });
    builder.addCase(deleteFcmToken.fulfilled, (state) => {
      state.id = null;
    });
  },
});

export default notificationSlice.reducer;
