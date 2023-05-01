import React, { useState } from "react";
import { Translate } from "../i18n";
import { useSelector } from "react-redux";
import "./floatingButton.css";
import {
  PersonAddAltOutlined,
  NoteAddOutlined,
  Edit,
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
  const { language } = useSelector((state) => state.configReducer);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const actions = [
    {
      icon: <PersonAddAltOutlined />,
      name: Translate("addMember", language),
      onClick: () => setModalVisibleEmployee(true),
    },
    {
      icon: <NoteAddOutlined />,
      name: Translate("addProject", language),
      onClick: () => setModalVisibleProject(true),
    },
  ];
  return type === "DailyReport" ? (
    <Box className="FBtn">
      <Fab
        aria-label="edit"
        style={styles.btn}
        onClick={() => setModalVisibleProject(true)}
      >
        <Edit />
      </Fab>
    </Box>
  ) : (
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
            onClick={() => (handleClose(), action.onClick())}
            FabProps={{ style: styles.btn }}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

const styles = {
  btn: {
    backgroundColor: "#f6921e",
    color: "#fff",
  },
};

export default FloatingButton;
