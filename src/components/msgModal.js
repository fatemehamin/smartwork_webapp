import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Collapse } from "@mui/material";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { ReactComponent as MsgIcon } from "../assets/icons/msg-send.svg";
import { sendMsg } from "../features/msg/action";
import { fetchProject } from "../features/projects/action";
import { setCartableFilter } from "../features/config/configSlice";
import Input from "./input";
import Button from "./button";
import Alert from "./alert";
import Modal from "./modal";
import "./msgModal.css";
import {
  ExpandLess,
  ChevronRightOutlined,
  ChevronLeftOutlined,
} from "@mui/icons-material";

const MsgModal = ({ modalVisible, setModalVisible }) => {
  const { language } = useSelector((state) => state.i18n);
  const { users } = useSelector((state) => state.users);
  const { tasks } = useSelector((state) => state.tasks);
  const { userInfo, type } = useSelector((state) => state.auth);
  const { cartableFilter } = useSelector((state) => state.config);

  const [explain, setExplain] = useState("");
  const [project, setProject] = useState("");
  const [user, setUser] = useState({ name: "", phoneNumber: "" });
  const [isCollapseUser, setIsCollapseUser] = useState(false);
  const [isCollapseProject, setIsCollapseProject] = useState(false);
  const [isAlert, setIsAlert] = useState(false);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    const userFilter = users.find((u) => u.phone_number === cartableFilter);
    if (cartableFilter !== "all") {
      setUser({
        name: userFilter.first_name + " " + userFilter.last_name,
        phoneNumber: cartableFilter,
        project_list: userFilter?.project_list,
      });
    }
  }, []);

  const closeModal = () => setModalVisible(false);
  const closeCollapseProject = () => setIsCollapseProject(false);
  const closeCollapseUser = () => setIsCollapseUser(false);
  const openAlert = () => setIsAlert(true);

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const handelCancel = () => {
    closeModal();
    closeCollapseProject();
    closeCollapseUser();
  };

  const handelModalSendMessage = () => {
    const canSend = explain.trim() && (project !== null ? project : true);
    if (!canSend) {
      openSnackbar(Translate("errorSendMsg", language));
    } else {
      closeModal();
      closeCollapseProject();
      closeCollapseUser();
      openAlert();
    }
  };

  const handelSendMessage = () => {
    const args = {
      from: userInfo.phoneNumber,
      to: user.phoneNumber,
      msg: explain,
      project,
    };

    dispatch(sendMsg(args)).unwrap().catch(_error);
    cartableFilter !== user.phoneNumber && dispatch(setCartableFilter("all"));
  };

  const getListProject = () => {
    const handelSelectAll = () => {
      setProject(null);
      closeCollapseProject();
    };

    const all = (
      <div
        key="all"
        className="msg-modal-project msg-modal-project-all"
        onClick={handelSelectAll}
      >
        {Translate("all", language)}
      </div>
    );

    const projects = type === "boss" ? user.project_list : tasks;

    const otherProject = projects?.map((p, i) => {
      const handelSelect = () => {
        setProject(p.project_name);
        closeCollapseProject();
      };
      return (
        <div key={i} className="msg-modal-project" onClick={handelSelect}>
          {p.project_name}
        </div>
      );
    });

    const listProject =
      type === "boss"
        ? user.phoneNumber === null
          ? [all, otherProject]
          : otherProject
        : otherProject;

    return listProject?.length > 0 ? (
      listProject
    ) : (
      <p className="msg-modal-no-project">{Translate("noProject", language)}</p>
    );
  };

  const getListUser = () => {
    const handelSelectAll = () => {
      const _then = (res) => {
        setUser({
          name: Translate("all", language),
          phoneNumber: null,
          project_list: res,
        });
        setProject("");
        closeCollapseUser();
      };

      dispatch(fetchProject()).unwrap().then(_then).catch(_error);
    };
    const all = (
      <div
        key="all"
        className="msg-modal-project msg-modal-project-all"
        onClick={handelSelectAll}
      >
        {Translate("all", language)}
      </div>
    );

    const otherUser = users.map((u, i) => {
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
    });

    return [all, ...otherUser];
  };

  return (
    <>
      <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
        <h2 className="text-center">
          {Translate(type === "boss" ? "sendMessage" : "taskRequest", language)}
        </h2>
        <CustomCollapse
          isCollapse={isCollapseUser}
          setIsCollapse={setIsCollapseUser}
          list={getListUser()}
          item={user.name ? user.name : Translate("user", language)}
          onClick={closeCollapseProject}
        />
        <CustomCollapse
          isCollapse={isCollapseProject}
          setIsCollapse={setIsCollapseProject}
          list={getListProject()}
          item={
            project !== null
              ? project
                ? project
                : Translate("project", language)
              : Translate("all", language)
          }
          onClick={closeCollapseUser}
        />
        <Input
          value={explain}
          setValue={setExplain}
          placeholder={Translate("explain", language)}
          multiline
        />
        <div className="container_btn_row direction">
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
        title="sendMessage?"
        Icon={MsgIcon}
        ButtonAction={[
          { text: "continue", onClick: handelSendMessage },
          { text: "cancel", type: "SECONDARY" },
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
    } direction`,
    collapseBtnText: `msg-modal-btn-collapse-title ${
      isCollapse ? "msg-modal-btn-collapse-title-open" : ""
    }`,
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
