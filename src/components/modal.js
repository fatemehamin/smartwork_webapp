import React from "react";
import Button from "./button";
import { Drawer } from "@mui/material";
import { Translate } from "../features/i18n/translate";
import { useSelector } from "react-redux";

const Modal = ({
  label,
  modalVisible,
  setModalVisible,
  customStyle,
  buttonActions,
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
      <h2 className="text-center" style={{ margin: 5 }}>
        {Translate(label, language)}
      </h2>
      {props.children}
      {buttonActions !== undefined && (
        <div className="container_btn_row direction">
          <Button
            label={Translate(buttonActions[0].text, language)}
            customStyle={{ width: "40%" }}
            isLoading={buttonActions[0].isLoading}
            disabled={buttonActions[0].disable}
            onClick={buttonActions[0].action}
          />
          <Button
            label={Translate(buttonActions[1].text, language)}
            customStyle={{ width: "40%" }}
            onClick={buttonActions[1].action}
            type="SECONDARY"
          />
        </div>
      )}
    </Drawer>
  );
};
export default Modal;
