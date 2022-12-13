import React from "react";
import { Drawer } from "@mui/material";

export default ({ modalVisible, setModalVisible, ...props }) => {
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setModalVisible(open);
  };
  return (
    <Drawer
      anchor="bottom"
      open={modalVisible}
      onClose={toggleDrawer(false)}
      PaperProps={{ sx: styles.modal }}
    >
      {props.children}
    </Drawer>
  );
};

const styles = {
  modal: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    paddingBottom: 3,
  },
};
