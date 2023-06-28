import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collapse } from "@mui/material";
import Input from "./input";
import Button from "./button";
import Alert from "./alert";
import { Translate } from "../features/i18n/translate";
import Modal from "./modal";
import { useSnackbar } from "react-simple-snackbar";
import MsgIcon from "../assets/images/msg-send.svg";
import "./msgModal.css";
import {
  ExpandLess,
  ChevronRightOutlined,
  ChevronLeftOutlined,
} from "@mui/icons-material";

const MsgModal = ({ modalVisible, setModalVisible }) => {
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const { phoneNumber } = useSelector((state) => state.auth);
  const [explain, setExplain] = useState("");
  const [project, setProject] = useState("");
  const [user, setUser] = useState({ name: "", phoneNumber: "" });
  const [isCollapseUser, setIsCollapseUser] = useState(false);
  const [isCollapseProject, setIsCollapseProject] = useState(false);
  const [isAlert, setIsAlert] = useState(false);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const closeModal = () => setModalVisible(false);
  const closeCollapseProject = () => setIsCollapseProject(false);
  const closeCollapseUser = () => setIsCollapseUser(false);
  const openAlert = () => setIsAlert(true);

  const handelCancel = () => {
    closeModal();
    closeCollapseProject();
    closeCollapseUser();
  };

  const handelModalSendMessage = () => {
    const canSend = explain.trim() && project;
    if (!canSend) {
      openSnackbar(Translate("errorSendMsg", language));
    } else {
      closeModal();
      closeCollapseProject();
      closeCollapseUser();
      openAlert();
    }
  };

  const handelAlertSendMessage = () => {};

  const listProject = user.project_list?.map((p) => {
    const handelSelect = () => {
      setProject(p.project_name);
      closeCollapseProject();
    };
    return (
      <div className="msg-modal-project" onClick={handelSelect}>
        {p.project_name}
      </div>
    );
  });

  const listUser = useSelector((state) =>
    state.users.users.map((u, i) => {
      const name = u.first_name + " " + u.last_name;
      const handelSelect = () => {
        setUser({
          name,
          phoneNumber: u.phone_number,
          project_list: u.project_list,
        });
        setProject("");
        closeCollapseUser();
      };
      return (
        <div key={i} className="msg-modal-project" onClick={handelSelect}>
          {name}
        </div>
      );
    })
  );

  return (
    <>
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <h2 className="text-center">{Translate("sendMessage", language)}</h2>
        <CustomCollapse
          isCollapse={isCollapseUser}
          setIsCollapse={setIsCollapseUser}
          list={listUser}
          item={user.name ? user.name : Translate("user", language)}
          onClick={closeCollapseProject}
        />
        <CustomCollapse
          isCollapse={isCollapseProject}
          setIsCollapse={setIsCollapseProject}
          list={listProject}
          item={project ? project : Translate("project", language)}
          onClick={closeCollapseUser}
        />
        <Input
          value={explain}
          setValue={setExplain}
          placeholder={Translate("explain", language)}
          multiline
        />
        <div
          className={`container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`}
        >
          <Button
            label={Translate("send", language)}
            customStyle={{ width: "40%" }}
            onClick={handelModalSendMessage}
          />
          <Button
            label={Translate("cancel", language)}
            customStyle={{ width: "40%" }}
            onClick={handelCancel}
            type="SECONDARY"
          />
        </div>
      </Modal>
      <Alert
        open={isAlert}
        setOpen={setIsAlert}
        title={Translate("sendMessage", language)}
        Icon={() => <img src={MsgIcon} alt="Msg" />}
        ButtonAction={[
          {
            text: Translate("continue", language),
            onClick: handelAlertSendMessage,
          },
          { text: Translate("cancel", language), type: "SECONDARY" },
        ]}
      />
    </>
  );
};

const CustomCollapse = ({ isCollapse, setIsCollapse, list, item, onClick }) => {
  const { I18nManager } = useSelector((state) => state.i18n);
  const toggleCollapse = () => setIsCollapse((collapse) => !collapse);

  const handelClick = () => {
    onClick !== undefined && onClick();
    toggleCollapse();
  };
  const className = {
    collapseBtn: `msg-modal-btn-collapse ${
      isCollapse ? "msg-modal-border-top" : ""
    } ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    collapseBtnText: `msg-modal-btn-collapse-title${isCollapse ? "-open" : ""}`,
  };

  return (
    <div className="msg-modal-select-project">
      <Collapse sx={{ maxHeight: 200, overflow: "scroll" }} in={isCollapse}>
        {list}
      </Collapse>
      <div className={className.collapseBtn} onClick={handelClick}>
        <span className={className.collapseBtnText}>{item}</span>
        {isCollapse ? (
          <ExpandLess />
        ) : I18nManager.isRTL ? (
          <ChevronLeftOutlined />
        ) : (
          <ChevronRightOutlined />
        )}
      </div>
    </div>
  );
};

export default MsgModal;
