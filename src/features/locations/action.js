import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchLocationSpacialUser = createAsyncThunk(
  "locations/fetchLocationSpacialUser",
  async (phone_number) => {
    const res = await axiosAPI.get(`/location_user/${phone_number}/`);
    return res.data.detail;
  }
);

export const fetchLocations = createAsyncThunk(
  "locations/fetchLocation",
  async () => {
    const res = await axiosAPI.get("/location/");
    return res.data.detail;
  }
);

export const addLocation = createAsyncThunk(
  "locations/addLocation",
  async ({ latitude, longitude, location_name, radius, phoneNumber }) => {
    await axiosAPI.post("/location/", {
      x: latitude,
      y: longitude,
      location_name,
      radios: radius,
      company_boss: phoneNumber,
    });
    return { latitude, longitude, location_name, radius };
  }
);

export const deleteLocation = createAsyncThunk(
  "locations/deleteLocation",
  async (location_name) => {
    await axiosAPI.delete("/location/", { data: { location_name } });
    return location_name;
  }
);
