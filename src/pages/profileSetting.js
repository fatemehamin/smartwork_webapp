import React, { useCallback, useMemo, useState } from "react";
import Alert from "../components/alert";
import AppBar from "../components/appBar";
import AvatarProfile from "../components/avatarProfile";
import SettingBar from "../components/settingBar";
import { ReactComponent as PersonDelete } from "../assets/icons/person_delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { deleteUsers, permissionAccess } from "../features/users/action";
import { Switch } from "@mui/material";
import { Translate } from "../features/i18n/translate";
import "./profileSetting.css";
import {
  Cancel,
  PinDropRounded,
  AssignmentRounded,
  PersonRounded,
  AccessTimeFilledRounded,
  AutoModeRounded,
  AddTaskRounded,
  AdminPanelSettingsRounded,
} from "@mui/icons-material";

const ProfileSetting = () => {
  const { id } = useParams();

  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [isLoadingAutoExit, setIsLoadingAutoExit] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const { language } = useSelector((state) => state.i18n);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { users, isLoading, profileUsers } = useSelector(
    (state) => state.users
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openSnackbar] = useSnackbar();

  const userCurrent = useMemo(
    () => users.filter((user) => user.id == id)[0],
    [users, id]
  );

  const profileUser = useMemo(
    () => profileUsers.find((p) => p.id == id)?.profile,
    [profileUsers, id]
  );

  const BossOrYou =
    phoneNumber === userCurrent.phone_number || userCurrent.is_boss;

  const openAlertRemove = useCallback(() => {
    if (!BossOrYou) {
      setOpenAlert(true);
    }
  }, []);

  const _errorRemoveUser = useCallback(
    (error) =>
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "403"
          ? Translate("canNotRemoveَAdmin", language)
          : error.message
      ),
    [language]
  );

  const handleRemoveUser = useCallback(() => {
    navigate("/manager");
    setTimeout(() => {
      dispatch(deleteUsers(userCurrent.phone_number))
        .unwrap()
        .catch(_errorRemoveUser);
    }, 1000);
  }, [userCurrent]);

  const propsAlert = useMemo(
    () => ({
      title: "deleteUser",
      description: "deleteUserDescription",
      Icon: PersonDelete,
      ButtonAction: [
        { text: "continue", onClick: handleRemoveUser, isLoading },
        { text: "cancel", type: "SECONDARY" },
      ],
    }),
    [isLoading]
  );

  const _error = useCallback(
    (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message
      );
    },
    [language]
  );

  const handelEditProfile = useCallback(
    () => navigate(`/statusMember/${id}/editProfile`),
    [id]
  );

  const handelLocationUser = useCallback(
    () => navigate(`/statusMember/${id}/locationUser`),
    [id]
  );

  const handelProjectUser = useCallback(
    () => navigate(`/statusMember/${id}/projectUser`),
    [id]
  );

  const handleShiftUser = useCallback(
    () => navigate(`/statusMember/${id}/shiftUser`),
    [id]
  );

  const checkExcel = BossOrYou || userCurrent.financial_group;

  const disabledExcel = BossOrYou || isLoadingExcel || userCurrent.access_admin;

  const checkAdmin = BossOrYou || userCurrent.access_admin;

  const disabledAdmin = BossOrYou || isLoadingAdmin;

  const handleSwitch = useCallback(
    (loadingFunc, typePermission) => {
      loadingFunc(true);

      const isToggle = (() => {
        switch (typePermission) {
          case "accessExcel":
            return !userCurrent.financial_group;
          case "autoExit":
            return !userCurrent.permissionAutoExit;
          case "accessAdmin":
            return !userCurrent.access_admin;
          default:
            return null;
        }
      })();

      const args = {
        phoneNumber: userCurrent.phone_number,
        typePermission,
        isToggle,
      };

      dispatch(permissionAccess(args))
        .unwrap()
        .then((res) => loadingFunc(false))
        .catch(_error);
    },
    [userCurrent]
  );

  return (
    <div className="status-member ">
      <AppBar label="profileSetting" type="back" />

      <div className="display-flex-center direction section-container">
        <AvatarProfile img={profileUser} />
        <p className="profile-name text-align">{userCurrent.full_name}</p>
      </div>

      <div className="section-container">
        <div className="main-title text-align">
          {Translate("general", language)}
        </div>

        <SettingBar
          onClick={handelEditProfile}
          title="editProfile"
          info="changeProfilePictureNameNumber"
          Icon={PersonRounded}
        />

        <SettingBar
          onClick={handelLocationUser}
          title="location"
          info="addLocationToUser"
          Icon={PinDropRounded}
        />
      </div>

      <div className="section-container">
        <div className="main-title text-align">
          {Translate("advanced", language)}
        </div>

        <SettingBar
          title="accessAdmin"
          info="accessAdminDescription"
          Icon={AdminPanelSettingsRounded}
          disabled={BossOrYou}
          EndAdornment={() => (
            <Switch
              defaultChecked={false}
              checked={checkAdmin}
              disabled={disabledAdmin}
              color="primaryDark"
              onChange={() => handleSwitch(setIsLoadingAdmin, "accessAdmin")}
            />
          )}
        />

        <SettingBar
          title="accessExcel"
          info="accessExcelDescription"
          Icon={AssignmentRounded}
          disabled={disabledExcel}
          EndAdornment={() => (
            <Switch
              defaultChecked={false}
              checked={checkExcel}
              disabled={disabledExcel}
              color="primaryDark"
              onChange={() => handleSwitch(setIsLoadingExcel, "accessExcel")}
            />
          )}
        />

        <SettingBar
          title="autoExit"
          info="autoExitDescription"
          Icon={AutoModeRounded}
          EndAdornment={() => (
            <Switch
              defaultChecked={false}
              checked={userCurrent.permissionAutoExit}
              disabled={isLoadingAutoExit}
              color="primaryDark"
              onChange={() => handleSwitch(setIsLoadingAutoExit, "autoExit")}
            />
          )}
        />

        <SettingBar
          onClick={handelProjectUser}
          title="project"
          info="addProjectToUser"
          Icon={AddTaskRounded}
        />

        <SettingBar
          onClick={handleShiftUser}
          title="shiftWork"
          info="addShiftToUser"
          Icon={AccessTimeFilledRounded}
        />

        <SettingBar
          onClick={openAlertRemove}
          title="removeUser"
          info="allUserInfoRemove"
          Icon={Cancel}
          color="#9d0a0a"
          disabled={BossOrYou}
        />
      </div>

      <Alert open={openAlert} setOpen={setOpenAlert} {...propsAlert} />
    </div>
  );
};

export default ProfileSetting;
