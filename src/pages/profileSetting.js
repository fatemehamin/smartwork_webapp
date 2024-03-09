import React, { useCallback, useEffect, useMemo, useState } from "react";
import AppBar from "../components/appBar";
import CheckBox from "../components/checkBox";
import AvatarProfile from "../components/avatarProfile";
import SettingBar from "../components/settingBar";
import { ReactComponent as PersonDelete } from "../assets/icons/person_delete.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchLocations } from "../features/locations/action";
import { fetchShiftWork } from "../features/shiftWork/action";
import { fetchProject } from "../features/projects/action";
import "./profileSetting.css";
import {
  Done,
  KeyboardArrowDownOutlined,
  Cancel,
  PinDropRounded,
  AssignmentRounded,
  PersonRounded,
  AccessTimeFilledRounded,
  AutoModeRounded,
  AddTaskRounded,
  AdminPanelSettingsRounded,
} from "@mui/icons-material";
import {
  addLocationToUsers,
  addProjectToUsers,
  deleteLocationToUsers,
  deleteProjectToUsers,
  deleteUsers,
  fetchUsersLocation,
  permissionAccess,
  toggleShiftToUsers,
} from "../features/users/action";
import {
  Chip,
  Collapse,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  Switch,
} from "@mui/material";
import Alert from "../components/alert";

const ProfileSetting = () => {
  const { currentId } = useParams();

  const [isLoadingExcel, setIsLoadingExcel] = useState(false);
  const [isLoadingAutoExit, setIsLoadingAutoExit] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(false);
  const [isCollapseLocation, setIsCollapseLocation] = useState(false);
  const [isCollapseProject, setIsCollapseProject] = useState(false);
  const [isCollapseShift, setIsCollapseShift] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const { language } = useSelector((state) => state.i18n);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { locations } = useSelector((state) => state.locations);
  const { shift } = useSelector((state) => state.shift);
  const { projects } = useSelector((state) => state.projects);
  const { users, isLoading, profileUsers } = useSelector(
    (state) => state.users
  );

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openSnackbar] = useSnackbar();

  const userCurrent = useMemo(
    () => users.filter((user) => user.id == currentId)[0],
    [users, currentId]
  );

  const profileUser = useMemo(
    () => profileUsers.find((p) => p.id == currentId)?.profile,
    [profileUsers, currentId]
  );
  const isBoss = phoneNumber === userCurrent.phone_number;

  useEffect(() => {
    fetchLocation();
    fetchProjects();
    fetchShift();
  }, []);

  const toggleCollapseLocation = useCallback(
    () => setIsCollapseLocation((c) => !c),
    []
  );

  const toggleCollapseShift = useCallback(
    () => setIsCollapseShift((c) => !c),
    []
  );

  const toggleCollapseProject = useCallback(
    () => setIsCollapseProject((c) => !c),
    []
  );

  const openAlertRemove = useCallback(() => {
    if (!isBoss) {
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
    dispatch(deleteUsers(userCurrent.phone_number))
      .unwrap()
      .catch(_errorRemoveUser);
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
    () => navigate(`/statusMember/${currentId}/editProfile`),
    [currentId]
  );

  //--------------------------------------excel--------------------------//

  const checkExcel = isBoss || userCurrent.financial_group;

  const disabledExcel = isBoss || isLoadingExcel || userCurrent.access_admin;

  const disabledAdmin = isBoss || isLoadingAdmin;

  const checkAdmin = isBoss || userCurrent.access_admin;

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
  //--------------------------------------location--------------------------//

  const fetchLocation = useCallback(() => {
    dispatch(fetchLocations()).unwrap().catch(_error);
    dispatch(fetchUsersLocation(userCurrent.phone_number))
      .unwrap()
      .catch(_error);
  }, [userCurrent]);

  const onChangeCheck = useCallback(
    (e, selectedLocation) => {
      const arg = {
        phone_number: userCurrent.phone_number,
        selectedLocation,
      };

      dispatch(
        e.target.checked ? addLocationToUsers(arg) : deleteLocationToUsers(arg)
      )
        .unwrap()
        .catch(_error);
    },
    [userCurrent]
  );

  const checkToggleLocation = useCallback(
    (nameLocation) =>
      !!userCurrent.location &&
      !!userCurrent.location.find((loc) => loc.location_name === nameLocation),
    [userCurrent]
  );

  const getListLocation = () => (
    <Collapse in={isCollapseLocation} className="profile-setting-collapse">
      {locations.length > 0 ? (
        locations.map((l, i) => (
          <CheckBox
            key={i}
            name={l.location_name}
            disabled={isLoading}
            onChange={(e) => onChangeCheck(e, l)}
            defaultChecked={false}
            toggle={checkToggleLocation(l.location_name)}
          />
        ))
      ) : (
        <div className="noItemText direction">
          {Translate("notExistLocation", language)}
        </div>
      )}
    </Collapse>
  );

  //--------------------------------------project--------------------------//

  const fetchProjects = useCallback(
    () => dispatch(fetchProject()).unwrap().catch(_error),
    []
  );

  const handleToggleProject = useCallback(
    (projectName, isSelected) => {
      const arg = {
        phone_number: userCurrent.phone_number,
        project_name: projectName,
      };

      dispatch(isSelected ? deleteProjectToUsers(arg) : addProjectToUsers(arg))
        .unwrap()
        .catch(_error);
    },
    [userCurrent]
  );

  const isSelectProject = useCallback(
    (projectName) =>
      !!userCurrent.project_list.find((p) => p.project_name === projectName),
    [userCurrent]
  );

  const styles = {
    check: {
      backgroundColor: "#269dd840",
      fontWeight: 500,
      fontFamily: "Vazirmatn, sans-serif",
      minWidth: 50,
    },
    unCheck: {
      fontWeight: 500,
      fontFamily: "Vazirmatn, sans-serif",
      minWidth: 50,
    },
    doneIcon: {
      color: "#176085 !important",
      margin: "0px !important",
    },
  };

  const getListProject = () => (
    <Collapse in={isCollapseProject} className="profile-setting-collapse">
      <Stack direction="row" className="chip-container" spacing={1} rowGap={2}>
        {projects.length > 0 ? (
          projects.map((project, i) =>
            isSelectProject(project.project_name) ? (
              <Chip
                key={i}
                label={project.project_name}
                disabled={isLoading}
                style={styles.check}
                deleteIcon={<Done sx={styles.doneIcon} />}
                onDelete={() =>
                  handleToggleProject(
                    project.project_name,
                    isSelectProject(project.project_name)
                  )
                }
              />
            ) : (
              <Chip
                key={i}
                label={project.project_name}
                disabled={isLoading}
                style={styles.unCheck}
                variant="outlined"
                onClick={() =>
                  handleToggleProject(
                    project.project_name,
                    isSelectProject(project.project_name)
                  )
                }
              />
            )
          )
        ) : (
          <div className="noItemText direction">
            {Translate("notExistProject", language)}
          </div>
        )}
      </Stack>
    </Collapse>
  );

  //--------------------------------------shift--------------------------//
  const fetchShift = useCallback(
    () => dispatch(fetchShiftWork()).unwrap().catch(_error),
    []
  );

  const onChangeShift = useCallback(
    (id) => {
      dispatch(toggleShiftToUsers({ user_id: userCurrent.id, shift_id: id }));
    },
    [userCurrent]
  );

  const getListShift = () => (
    <Collapse in={isCollapseShift} className="profile-setting-collapse">
      <RadioGroup
        aria-labelledby="demo-radio-buttons-group-label"
        name="radio-buttons-group"
        defaultValue={userCurrent.shift}
        className="text-align direction"
        sx={{ pl: 1.4, pr: 1.4 }}
      >
        <FormControlLabel
          label={Translate("noShift", language)}
          value={null}
          disabled={isLoading}
          control={<Radio />}
          onChange={() => onChangeShift(null)}
          sx={{ width: "100%" }}
          checked={userCurrent.shift === null}
        />
        {shift.length > 0 &&
          shift.map((s, i) => (
            <FormControlLabel
              key={i}
              sx={{ width: "100%" }}
              label={s.name}
              value={s.id}
              disabled={isLoading}
              control={<Radio />}
              onChange={() => onChangeShift(s.id)}
            />
          ))}
      </RadioGroup>
    </Collapse>
  );

  return (
    <div className="status-member ">
      <AppBar label={Translate("profileSetting", language)} type="back" />

      <div className="display-flex-center direction section-container">
        <AvatarProfile img={profileUser} />
        <p className="profile-name">{userCurrent.full_name}</p>
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
          title="location"
          info="addLocationToUser"
          Icon={PinDropRounded}
          onClick={toggleCollapseLocation}
          Collapse={getListLocation}
          EndAdornment={
            isCollapseLocation &&
            (() => <KeyboardArrowDownOutlined fontSize="large" />)
          }
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
          disabled={isBoss}
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
          title="project"
          info="addProjectToUser"
          Icon={AddTaskRounded}
          onClick={toggleCollapseProject}
          Collapse={getListProject}
          EndAdornment={
            isCollapseProject &&
            (() => <KeyboardArrowDownOutlined fontSize="large" />)
          }
        />

        <SettingBar
          title="shiftWork"
          info="addShiftToUser"
          Icon={AccessTimeFilledRounded}
          onClick={toggleCollapseShift}
          Collapse={getListShift}
          EndAdornment={
            isCollapseShift &&
            (() => <KeyboardArrowDownOutlined fontSize="large" />)
          }
        />

        <SettingBar
          onClick={openAlertRemove}
          title="removeUser"
          info="allUserInfoRemove"
          Icon={Cancel}
          color="#9d0a0a"
          disabled={isBoss}
        />
      </div>

      <Alert open={openAlert} setOpen={setOpenAlert} {...propsAlert} />
    </div>
  );
};

export default ProfileSetting;
