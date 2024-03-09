import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosAPI from "../../services/API";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const res = await axiosAPI.get("/employee_register/");
  return res.data.detail;
});

export const addUsers = createAsyncThunk(
  "users/addUsers",
  async ({
    firstName,
    lastName,
    password,
    callingCode,
    country,
    phoneNumber,
  }) => {
    const res = await axiosAPI.post("/employee_register/", {
      first_name: firstName,
      last_name: lastName,
      password,
      phone_number: phoneNumber,
      callingCode: country + callingCode,
    });
    return {
      first_name: firstName,
      last_name: lastName,
      full_name: firstName + " " + lastName,
      calling_code: country + callingCode,
      password,
      phone_number: phoneNumber,
      email: "",
      deactive_project: [],
      financial_group: false,
      permissionAutoExit: false,
      language: "EN",
      shift: null,
      now_active_project: "nothing",
      project_list: [],
      id: res.data.user_id,
    };
  }
);

export const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (phoneNumber) => {
    await axiosAPI.delete(`/employee_register/${phoneNumber}/`);
    return phoneNumber;
  }
);

export const editUsers = createAsyncThunk(
  "users/editUsers",
  async ({
    first_name,
    last_name,
    email,
    callingCode,
    country,
    old_phone_number,
    new_phone_number,
  }) => {
    await axiosAPI.patch("/edit_user_information/", {
      first_name,
      last_name,
      email,
      phone_number: old_phone_number,
      calling_code: country + callingCode,
    });

    old_phone_number !== new_phone_number &&
      (await axiosAPI.put("/edit_user_information/", {
        newUsername: new_phone_number,
        oldUsername: old_phone_number,
        calling_code: country + callingCode,
      }));

    return {
      first_name,
      last_name,
      email,
      old_phone_number,
      new_phone_number,
      calling_code: country + callingCode,
    };
  }
);

export const FetchImageUsers = createAsyncThunk(
  "users/FetchImageUsers",
  async () => {
    const res = await axiosAPI.get("/image_user/");

    return res.data.list_profile;
  }
);

export const addImageUser = createAsyncThunk(
  "users/addImageUser",
  async ({ base64Profile, fileName, profile, id }) => {
    const formData = new FormData();
    formData.append(fileName, profile);

    await axiosAPI({
      method: "post",
      url: `/image_user/${id}/${fileName}/`,
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    });

    return { id, profile: base64Profile };
  }
);

export const permissionAccess = createAsyncThunk(
  "users/accessExcel",
  async ({ phoneNumber, typePermission, isToggle }) => {
    await axiosAPI.put(
      `/employee_register/${phoneNumber}/${typePermission}/${isToggle}/`
    );
    return { phoneNumber, typePermission, isToggle };
  }
);

export const fetchUsersLocation = createAsyncThunk(
  "users/fetchUsersLocation",
  async (phone_number) => {
    const res = await axiosAPI.get(`/location_user/${phone_number}/`);
    return { phone_number, locations: res.data.detail };
  }
);

export const addLocationToUsers = createAsyncThunk(
  "users/addLocationToUsers",
  async ({ phone_number, selectedLocation }) => {
    await axiosAPI.post("/location_user/", {
      employee_user: phone_number,
      location_name: selectedLocation.location_name,
    });
    return { selectedLocation, phone_number };
  }
);

export const deleteLocationToUsers = createAsyncThunk(
  "users/deleteLocationToUsers",
  async ({ phone_number, selectedLocation }) => {
    await axiosAPI.delete(`/location_user/`, {
      data: {
        employee_user: phone_number,
        location_name: selectedLocation.location_name,
      },
    });
    return { selectedLocation, phone_number };
  }
);

export const addProjectToUsers = createAsyncThunk(
  "users/addProjectToUsers",
  async ({ phone_number, project_name }) => {
    await axiosAPI.post("/project_register/", { phone_number, project_name });
    return { phone_number, project_name };
  }
);

export const deleteProjectToUsers = createAsyncThunk(
  "users/deleteProjectToUsers",
  async ({ phone_number, project_name }) => {
    await axiosAPI.delete(`/project_state/`, {
      data: { employee_username: phone_number, project_name },
    });
    return { phone_number, project_name };
  }
);

export const toggleShiftToUsers = createAsyncThunk(
  "users/toggleShiftToUsers",
  async ({ user_id, shift_id }) => {
    await axiosAPI.patch(
      shift_id
        ? `/shift_work/${user_id}/${shift_id}/`
        : `/shift_work/${user_id}/`
    );
    return { user_id, shift_id };
  }
);
