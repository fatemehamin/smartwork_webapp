import React, { useCallback, useEffect, useMemo } from "react";
import AppBar from "../components/appBar";
import SettingBar from "../components/settingBar";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchProject } from "../features/projects/action";
import { Chip, Stack } from "@mui/material";
import "./profileSetting.css";
import {
  Done,
  KeyboardArrowDownOutlined,
  AddTaskRounded,
} from "@mui/icons-material";
import {
  addProjectToUsers,
  deleteProjectToUsers,
} from "../features/users/action";

const ProjectUser = () => {
  const { currentId } = useParams();

  const { language } = useSelector((state) => state.i18n);
  const { projects } = useSelector((state) => state.projects);
  const { users, isLoading } = useSelector((state) => state.users);

  const dispatch = useDispatch();

  const [openSnackbar] = useSnackbar();

  const { phone_number, project_list } = useMemo(
    () => users.filter((user) => user.id == currentId)[0],
    [users, currentId]
  );

  useEffect(() => {
    dispatch(fetchProject()).unwrap().catch(_error);
    window.scrollTo(0, 0);
  }, []);

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

  const isSelect = useCallback(
    (projectName) => !!project_list.find((p) => p.project_name === projectName),
    [project_list]
  );

  const handleToggleProject = useCallback(
    (projectName) => {
      const arg = {
        phone_number,
        project_name: projectName,
      };

      const isSelected = isSelect(projectName);

      dispatch(isSelected ? deleteProjectToUsers(arg) : addProjectToUsers(arg))
        .unwrap()
        .catch(_error);
    },
    [phone_number, isSelect]
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

  return (
    <div className="status-member ">
      <AppBar label={Translate("project", language)} type="back" />

      <div className="section-container">
        <SettingBar
          title="project"
          info="addProjectToUser"
          Icon={AddTaskRounded}
          EndAdornment={() => <KeyboardArrowDownOutlined fontSize="large" />}
          Collapse={() => (
            <div className="profile-setting-collapse">
              <Stack
                direction="row"
                className="chip-container"
                spacing={1}
                rowGap={2}
              >
                {projects.length > 0 ? (
                  projects.map((p, i) => (
                    <Chip
                      key={i}
                      label={p.project_name}
                      disabled={isLoading}
                      icon={<Done sx={styles.doneIcon} />}
                      onClick={() => handleToggleProject(p.project_name)}
                      style={
                        styles[isSelect(p.project_name) ? "check" : "unCheck"]
                      }
                      variant={
                        isSelect(p.project_name) ? undefined : "outlined"
                      }
                    />
                  ))
                ) : (
                  <div className="noItemText direction">
                    {Translate("notExistProject", language)}
                  </div>
                )}
              </Stack>
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ProjectUser;
