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

const actions = [
  { icon: <PersonAddAltOutlined />, name: "Add member" },
  { icon: <NoteAddOutlined />, name: "Add project" },
];

export default ({ type = "Add" }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
            onClick={handleClose}
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
