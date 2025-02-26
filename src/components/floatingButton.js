import React, { useState } from "react";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";
import { PersonAddAlt1Rounded, NoteAddRounded } from "@mui/icons-material";
import "./floatingButton.css";
import {
  Box,
  Backdrop,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Fab,
} from "@mui/material";

const FloatingButton = ({
  setModalVisibleProject,
  setModalVisibleUser,
  isOneAction = true,
  Icon,
  onClick,
}) => {
  const [open, setOpen] = useState(false);

  const { language } = useSelector((state) => state.i18n);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const actions = [
    {
      icon: <PersonAddAlt1Rounded />,
      name: <p className="tooltipText">{Translate("addUser", language)}</p>,
      onClick: () => {
        handleClose();
        setModalVisibleUser(true);
      },
    },
    {
      icon: <NoteAddRounded />,
      name: <p className="tooltipText">{Translate("addProject", language)}</p>,
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

  return isOneAction ? (
    <Box className="FBtn">
      <Fab aria-label="edit" style={styles.btn} onClick={onClick}>
        <Icon />
      </Fab>
    </Box>
  ) : (
    <Box className="FBtn">
      <SpeedDial
        ariaLabel="SpeedDial"
        FabProps={{ style: styles.btn }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        <Backdrop open={open} />
        {open &&
          actions.map((action) => (
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
  );
};

export default FloatingButton;
