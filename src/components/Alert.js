import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useSelector } from "react-redux";

const Alert = ({ title, description, open, setOpen, ButtonAction }) => {
  const { I18nManager } = useSelector((state) => state.configReducer);

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        style={styles.textAlign(I18nManager.isRTL)}
      >
        {title}
      </DialogTitle>
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

const styles = {
  textAlign: (isRTL) => ({
    textAlign: isRTL ? "right" : "left",
  }),
};

export default Alert;
