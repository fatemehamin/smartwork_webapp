import React, { useCallback, useEffect, useMemo, useState } from "react";
import AppBar from "../components/appBar";
import SettingBar from "../components/settingBar";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { Translate } from "../features/i18n/translate";
import { fetchProject } from "../features/projects/action";
import { Chip, Collapse, Stack } from "@mui/material";
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

const ProfileSetting = () => {
  const { currentId } = useParams();

  const [isCollapseProject, setIsCollapseProject] = useState(false);

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

  const handleToggleProject = useCallback(
    (projectName, isSelected) => {
      const arg = {
        phone_number,
        project_name: projectName,
      };

      dispatch(isSelected ? deleteProjectToUsers(arg) : addProjectToUsers(arg))
        .unwrap()
        .catch(_error);
    },
    [phone_number]
  );

  const isSelect = useCallback(
    (projectName) => !!project_list.find((p) => p.project_name === projectName),
    [project_list]
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
                  projects.map((project, i) =>
                    isSelect(project.project_name) ? (
                      <Chip
                        key={i}
                        label={project.project_name}
                        disabled={isLoading}
                        style={styles.check}
                        deleteIcon={<Done sx={styles.doneIcon} />}
                        onDelete={() =>
                          handleToggleProject(
                            project.project_name,
                            isSelect(project.project_name)
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
                            isSelect(project.project_name)
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
            </div>
          )}
        />
      </div>
    </div>
  );
};

export default ProfileSetting;
