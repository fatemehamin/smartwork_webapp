import React from "react";
import Button from "./button";
import "./alert.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Alert = ({ Icon, title, description, open, setOpen, ButtonAction }) => {
  const closeAlert = () => setOpen(false);

  const HandleClickAction = (onClick) => {
    setOpen(false);
    onClick !== undefined && onClick();
  };

  const styles = {
    dialogContainer: {
      "& .MuiPaper-root": {
        width: 370,
        borderRadius: 4,
        alignItems: "center",
        padding: 1,
      },
    },
    dialogContent: { "& .MuiDialogContent-root": { padding: 0 } },
    customStyle: { width: "40%" },
  };

  return (
    <Dialog
      open={open}
      onClose={closeAlert}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={styles.dialogContainer}
    >
      {Icon !== undefined && <Icon className="alert-icon" />}
      <DialogTitle id="alert-dialog-title" className="text-align direction">
        {title}
      </DialogTitle>
      {description && (
        <DialogContent sx={styles.dialogContent} className="direction">
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions id="alert-dialog-actions" className="direction">
        {ButtonAction !== undefined &&
          ButtonAction.map((action) => (
            <Button
              key={action.text}
              label={action.text}
              customStyle={styles.customStyle}
              onClick={() => HandleClickAction(action.onClick)}
              type={action.type ? action.type : "PRIMARY"}
            />
          ))}
      </DialogActions>
    </Dialog>
  );
};

export default Alert;
