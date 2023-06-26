import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { Done } from "@mui/icons-material";
import { fetchProject } from "../features/projects/action";
import { useSnackbar } from "react-simple-snackbar";
import { Chip, Stack } from "@mui/material";
import {
  addProjectToUsers,
  deleteProjectToUsers,
} from "../features/users/action";

const SelectProjectToUser = ({ userCurrent, CustomCollapse }) => {
  const { isLoading } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProject())
      .unwrap()
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  }, []);

  const contentCollapse = () => (
    <Stack direction="row" className="chip-container" spacing={1} rowGap={2}>
      {projects.map((project, i) => {
        const selectProject = userCurrent.project_list.find(
          (p) => p.project_name === project.project_name
        );
        return selectProject !== undefined ? (
          <Chip
            key={i}
            label={project.project_name}
            deleteIcon={<Done />}
            onDelete={() => handleToggleProject(project.project_name, "delete")}
            disabled={isLoading}
            style={{ backgroundColor: "#f6921e60" }}
          />
        ) : (
          <Chip
            key={i}
            label={project.project_name}
            variant="outlined"
            disabled={isLoading}
            onClick={() => handleToggleProject(project.project_name)}
          />
        );
      })}
    </Stack>
  );

  const handleToggleProject = (project_name, type = "select") => {
    const arg = {
      phone_number: userCurrent.phone_number,
      project_name,
    };
    dispatch(
      type === "select" ? addProjectToUsers(arg) : deleteProjectToUsers(arg)
    )
      .unwrap()
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  };

  const className = {
    title: `main-title text-${I18nManager.isRTL ? "right" : "left"}`,
  };

  return (
    <div className="section-container">
      <div className={className.title}>{Translate("project", language)}</div>
      <CustomCollapse
        label={Translate("addProjectToUser", language)}
        content={contentCollapse}
        type="project"
      />
    </div>
  );
};

export default SelectProjectToUser;
