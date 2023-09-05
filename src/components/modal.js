import React from "react";
import { Drawer } from "@mui/material";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";

const Modal = ({
  label,
  modalVisible,
  setModalVisible,
  customStyle,
  ...props
}) => {
  const { language } = useSelector((state) => state.i18n);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setModalVisible(open);
  };

  const styles = {
    modal: {
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      paddingBottom: 3,
    },
  };

  return (
    <Drawer
      anchor="bottom"
      open={modalVisible}
      onClose={toggleDrawer(false)}
      PaperProps={{ sx: { ...styles.modal, ...customStyle } }}
    >
      <h2 className="text-center">{Translate(label, language)}</h2>
      {props.children}
    </Drawer>
  );
};
export default Modal;
