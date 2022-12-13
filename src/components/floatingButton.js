import React, { useState } from "react";
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

export default ({
  type = "Add",
  setModalVisibleProject,
  setModalVisibleEmployee,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const actions = [
    {
      icon: <PersonAddAltOutlined />,
      name: "Add member",
      onClick: () => setModalVisibleEmployee(true),
    },
    {
      icon: <NoteAddOutlined />,
      name: "Add project",
      onClick: () => setModalVisibleProject(true),
    },
  ];
  return type === "DailyReport" ? (
    <Box className="FBtn">
      <Fab
        aria-label="edit"
        style={styles.btn}
        onClick={() => console.log("open modal")}
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
