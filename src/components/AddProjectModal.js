import React, { useState } from "react";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { addProjects } from "../features/projects/action";
import Input from "./input";
import Modal from "./modal";

const AddProjectModal = ({ modalVisibleProject, setModalVisibleProject }) => {
  const [projectName, setProjectName] = useState("");

  const { isLoading } = useSelector((state) => state.projects);
  const { language } = useSelector((state) => state.i18n);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const disableAddProject = !projectName.trim();

  const closeModal = () => setModalVisibleProject(false);

  const handleAddProject = () => {
    const _then = (res) => {
      setProjectName("");
      closeModal();
      openSnackbar(Translate("NewProjectAddedSuccessfully", language));
    };

    const _error = (error) => {
      openSnackbar(
        error.code === "ERR_NETWORK"
          ? Translate("connectionFailed", language)
          : error.message.slice(-3) === "403"
          ? Translate("projectExists", language)
          : error.message
      );
    };

    dispatch(addProjects(projectName)).unwrap().then(_then).catch(_error);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13 && !disableAddProject) {
      handleAddProject();
    }
  };

  const propsModal = {
    modalVisible: modalVisibleProject,
    setModalVisible: setModalVisibleProject,
    label: "addProject",
    buttonActions: [
      {
        text: "add",
        action: handleAddProject,
        isLoading,
        disabled: disableAddProject,
      },
      { text: "cancel", action: closeModal },
    ],
  };

  return (
    <Modal {...propsModal}>
      <Input
        value={projectName}
        setValue={setProjectName}
        placeholder={Translate("projectName", language)}
        onKeyDown={onKeyDown}
        autoFocus
      />
    </Modal>
  );
};

export default AddProjectModal;
