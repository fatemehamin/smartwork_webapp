import React from "react";
import Button from "./button";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";
import "./alert.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Alert = ({
  Icon,
  title,
  description,
  open,
  setOpen,
  ButtonAction,
  ...props
}) => {
  const { language } = useSelector((state) => state.i18n);

  const TransDescription = Translate(description, language) || description;

  const closeAlert = () => setOpen(false);

  const HandleClickAction = (onClick) => {
    closeAlert();
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
    dialogContent: { pb: 0, pl: 1, pr: 1 },
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
      <DialogTitle id="alert-dialog-title" className="direction">
        {Translate(title, language)}
      </DialogTitle>
      {description && (
        <DialogContent sx={styles.dialogContent} className="direction">
          <DialogContentText id="alert-dialog-description">
            {TransDescription}
          </DialogContentText>
        </DialogContent>
      )}
      {props.children}
      {ButtonAction !== undefined && (
        <DialogActions id="alert-dialog-actions" className="direction">
          {ButtonAction.map((action) => (
            <Button
              key={action.text}
              label={Translate(action.text, language)}
              customStyle={styles.customStyle}
              onClick={() => HandleClickAction(action.onClick)}
              type={action.type ? action.type : "PRIMARY"}
            />
          ))}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default Alert;
