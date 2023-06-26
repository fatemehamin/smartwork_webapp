import React from "react";
import { Drawer } from "@mui/material";

const Modal = ({ modalVisible, setModalVisible, customStyle, ...props }) => {
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
      {props.children}
    </Drawer>
  );
};
export default Modal;
