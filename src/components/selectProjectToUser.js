import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { Done, ExpandLess, ExpandMore } from "@mui/icons-material";
import { fetchProject } from "../features/projects/action";
import { useSnackbar } from "react-simple-snackbar";
import { Chip, Collapse, Stack } from "@mui/material";
import {
  addProjectToUsers,
  deleteProjectToUsers,
} from "../features/users/action";

const SelectProjectToUser = ({ userCurrent, CustomCollapse }) => {
  const [isCollapseProject, setIsCollapseProject] = useState(false);

  const { isLoading } = useSelector((state) => state.users);
  const { projects } = useSelector((state) => state.projects);
  const { language } = useSelector((state) => state.i18n);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProject()).unwrap().catch(_error);
  }, []);

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const styles = {
    check: {
      backgroundColor: "#f6921e60",
      fontWeight: 500,
      fontFamily: "Vazirmatn, sans-serif",
    },
    unCheck: {
      fontWeight: 500,
      fontFamily: "Vazirmatn, sans-serif",
    },
  };

  const toggleCollapse = () => {
    setIsCollapseProject((isCollapse) => !isCollapse);
  };

  const getListProject = () => {
    return projects.length > 0 ? (
      projects.map((project, i) => {
        const isSelected =
          userCurrent.project_list.find(
            (p) => p.project_name === project.project_name
          ) !== undefined;

        const handleToggleProject = () => {
          const arg = {
            phone_number: userCurrent.phone_number,
            project_name: project.project_name,
          };
          dispatch(
            isSelected ? deleteProjectToUsers(arg) : addProjectToUsers(arg)
          )
            .unwrap()
            .catch(_error);
        };

        return isSelected ? (
          <Chip
            key={i}
            label={project.project_name}
            deleteIcon={<Done sx={{ color: "#b14a00 !important" }} />}
            disabled={isLoading}
            style={styles.check}
            onDelete={handleToggleProject}
          />
        ) : (
          <Chip
            key={i}
            label={project.project_name}
            variant="outlined"
            disabled={isLoading}
            onClick={handleToggleProject}
            style={styles.unCheck}
          />
        );
      })
    ) : (
      <div className="noItemText direction">
        {Translate("notExistProject", language)}
      </div>
    );
  };

  return (
    <div className="section-container">
      <div className="main-title text-align">
        {Translate("project", language)}
      </div>

      <div className="collapse direction" onClick={toggleCollapse}>
        <span>{Translate("addProjectToUser", language)}</span>
        <span style={{ color: "#f6921e" }}>
          {isCollapseProject ? (
            <ExpandLess fontSize="large" />
          ) : (
            <ExpandMore fontSize="large" />
          )}
        </span>
      </div>

      <Collapse in={isCollapseProject}>
        <Stack
          direction="row"
          className="chip-container"
          spacing={1}
          rowGap={2}
        >
          {getListProject()}
        </Stack>
      </Collapse>
    </div>
  );
};

export default SelectProjectToUser;
