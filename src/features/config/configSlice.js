import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  managerActiveTab: "users",
  cartableFilter: "all",
  myTaskActiveTab: "entryAndExit",
  myReportActiveTab: "summaryStatus",
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setManagerActiveTab: (state, action) => {
      state.managerActiveTab = action.payload;
      state.cartableFilter = "all";
    },
    setCartableFilter: (state, action) => {
      state.cartableFilter = action.payload;
    },
    setMyTaskActiveTab: (state, action) => {
      state.myTaskActiveTab = action.payload;
    },
    setMyReportActiveTab: (state, action) => {
      state.myReportActiveTab = action.payload;
    },
  },
});

export const {
  setManagerActiveTab,
  setCartableFilter,
  setMyTaskActiveTab,
  setMyReportActiveTab,
} = configSlice.actions;
export default configSlice.reducer;
