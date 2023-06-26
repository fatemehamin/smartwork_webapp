import { createSlice } from "@reduxjs/toolkit";
import {
  addLocation,
  deleteLocation,
  fetchLocations,
  fetchLocationSpacialUser,
} from "./action";

const initialState = {
  locations: [],
  locationSpacialUser: [],
  isLoading: false,
  error: null,
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchLocationSpacialUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLocationSpacialUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.locationSpacialUser = action.payload.map((location) => ({
        ...location,
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
      }));
    });
    builder.addCase(fetchLocationSpacialUser.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(fetchLocations.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      state.isLoading = false;
      state.locations = action.payload.map((location) => ({
        ...location,
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
      }));
    });
    builder.addCase(fetchLocations.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addLocation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addLocation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.locations.push(action.payload);
    });
    builder.addCase(addLocation.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteLocation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteLocation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.locations = state.locations.filter(
        (l) => l.location_name !== action.payload
      );
    });
    builder.addCase(deleteLocation.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default locationsSlice.reducer;
