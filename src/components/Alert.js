import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

export default ({ title, description, open, setOpen, ButtonAction }) => {
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {ButtonAction != undefined &&
          ButtonAction.map((action) => (
            <Button
              key={action.text}
              onClick={() => {
                setOpen(false);
                action.onClick != undefined && action.onClick();
              }}
            >
              {action.text}
            </Button>
          ))}
      </DialogActions>
    </Dialog>
  );
};
