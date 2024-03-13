import { createSlice } from "@reduxjs/toolkit";
import {
  addImageUser,
  addLocationToUsers,
  addProjectToUsers,
  addUsers,
  deleteLocationToUsers,
  deleteProjectToUsers,
  deleteUsers,
  editUsers,
  FetchImageUsers,
  fetchUsers,
  fetchUsersLocation,
  permissionAccess,
  toggleShiftToUsers,
} from "./action";

const initialState = {
  users: [],
  profileUsers: [],
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateNowActiveProject: (state, action) => {
      state.users = state.users.map((u) =>
        u.phone_number === action.payload.phoneNumber
          ? { ...u, now_active_project: action.payload.nowActiveProject }
          : u
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = action.payload;
    });
    builder.addCase(fetchUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.error = null;
      state.users.push(action.payload);
    });
    builder.addCase(addUsers.rejected, (state, action) => {
      state.isLoading = false;
      state.error =
        action.error.message.slice(-3) === "409" ? "phoneNumberExists" : null;
    });
    builder.addCase(deleteUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.filter(
        (user) => user.phone_number !== action.payload
      );
    });
    builder.addCase(deleteUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(editUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(editUsers.fulfilled, (state, action) => {
      const {
        first_name,
        last_name,
        email,
        old_phone_number,
        new_phone_number,
        calling_code,
      } = action.payload;

      const updateUser = (user) =>
        user.phone_number === old_phone_number
          ? {
              ...user,
              email,
              first_name,
              last_name,
              full_name: first_name + " " + last_name,
              calling_code,
              phone_number:
                new_phone_number !== undefined
                  ? new_phone_number
                  : old_phone_number,
            }
          : user;

      state.isLoading = false;
      state.users = state.users.map(updateUser);
    });
    builder.addCase(editUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(FetchImageUsers.fulfilled, (state, action) => {
      state.profileUsers = action.payload.map((image) => ({
        ...image,
        profile: image.image_urls,
      }));
    });
    builder.addCase(addImageUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addImageUser.fulfilled, (state, action) => {
      const { id, profile } = action.payload;
      state.isLoading = false;
      state.profileUsers = [
        ...state.profileUsers.filter((p) => p.id !== id),
        { id, profile },
      ];
    });
    builder.addCase(addImageUser.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(permissionAccess.fulfilled, (state, action) => {
      const { phoneNumber, isToggle, typePermission } = action.payload;
      state.users = state.users.map((user) =>
        user.phone_number === phoneNumber
          ? typePermission === "autoExit"
            ? { ...user, permissionAutoExit: isToggle }
            : typePermission === "accessAdmin"
            ? { ...user, access_admin: isToggle, financial_group: isToggle }
            : { ...user, financial_group: isToggle }
          : user
      );
    });
    builder.addCase(fetchUsersLocation.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchUsersLocation.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.map((user) =>
        user.phone_number === action.payload.phone_number
          ? {
              ...user,
              location: action.payload.locations.map((location) => ({
                ...location,
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
              })),
            }
          : user
      );
    });
    builder.addCase(fetchUsersLocation.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addLocationToUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addLocationToUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.map((user) =>
        user.phone_number === action.payload.phone_number
          ? {
              ...user,
              location: [...user.location, action.payload.selectedLocation],
            }
          : user
      );
    });
    builder.addCase(addLocationToUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteLocationToUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteLocationToUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.map((user) =>
        user.phone_number === action.payload.phone_number
          ? {
              ...user,
              location: user.location.filter(
                (l) =>
                  l.location_name !==
                  action.payload.selectedLocation.location_name
              ),
            }
          : user
      );
    });
    builder.addCase(deleteLocationToUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(addProjectToUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addProjectToUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.map((user) =>
        user.phone_number === action.payload.phone_number
          ? {
              ...user,
              project_list: [
                ...user.project_list,
                { project_name: action.payload.project_name, sum_duration: "" },
              ],
            }
          : user
      );
    });
    builder.addCase(addProjectToUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteProjectToUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteProjectToUsers.fulfilled, (state, action) => {
      state.isLoading = false;
      state.users = state.users.map((user) =>
        user.phone_number === action.payload.phone_number
          ? {
              ...user,
              project_list: user.project_list.filter(
                (p) => p.project_name !== action.payload.project_name
              ),
            }
          : user
      );
    });
    builder.addCase(deleteProjectToUsers.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(toggleShiftToUsers.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(toggleShiftToUsers.fulfilled, (state, action) => {
      const { user_id, shift_id } = action.payload;
      state.isLoading = false;
      state.users = state.users.map((user) =>
        user.id === user_id ? { ...user, shift: shift_id } : user
      );
    });
    builder.addCase(toggleShiftToUsers.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { updateNowActiveProject } = usersSlice.actions;
export default usersSlice.reducer;
