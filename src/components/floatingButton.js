import React, { useState } from "react";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";
import "./floatingButton.css";
import {
  PersonAddAltOutlined,
  NoteAddOutlined,
  Edit,
  Notes,
} from "@mui/icons-material";
import {
  Box,
  Backdrop,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Fab,
} from "@mui/material";

const FloatingButton = ({
  type = "Add",
  setModalVisibleProject,
  setModalVisibleEmployee,
}) => {
  const [open, setOpen] = useState(false);
  const { language } = useSelector((state) => state.i18n);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const OpenModalDailyReport = () => setModalVisibleProject(true);
  const actions = [
    {
      icon: <PersonAddAltOutlined />,
      name: Translate("addUser", language),
      onClick: () => {
        handleClose();
        setModalVisibleEmployee(true);
      },
    },
    {
      icon: <NoteAddOutlined />,
      name: Translate("addProject", language),
      onClick: () => {
        handleClose();
        setModalVisibleProject(true);
      },
    },
  ];

  const styles = {
    btn: {
      backgroundColor: "#f6921e",
      color: "#fff",
    },
  };

  return type === "DailyReport" ? (
    <Box className="FBtn">
      <Fab aria-label="edit" style={styles.btn} onClick={OpenModalDailyReport}>
        <Edit />
      </Fab>
    </Box>
  ) : type === "Add" ? (
    <Box className="FBtn">
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="SpeedDial"
        FabProps={{ style: styles.btn }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
            FabProps={{ style: styles.btn }}
          />
        ))}
      </SpeedDial>
    </Box>
  ) : (
    <Box className="FBtn">
      <Fab aria-label="edit" style={styles.btn} onClick={OpenModalDailyReport}>
        <Notes />
      </Fab>
    </Box>
  );
};

export default FloatingButton;
