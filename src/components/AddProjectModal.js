import React, { useState } from "react";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { addProjects } from "../features/projects/action";
import Input from "./input";
import Modal from "./modal";
import Button from "./button";

const AddProjectModal = ({ modalVisibleProject, setModalVisibleProject }) => {
  const [projectName, setProjectName] = useState("");
  const { isLoading } = useSelector((state) => state.users);
  const { language } = useSelector((state) => state.i18n);
  const [openSnackbar] = useSnackbar();
  const disableAddProject = !projectName.trim();
  const dispatch = useDispatch();
  const closeAddProjectModal = () => setModalVisibleProject(false);

  const handleAddProject = () => {
    const _then = (res) => {
      setProjectName("");
      setModalVisibleProject(false);
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

  return (
    <Modal
      modalVisible={modalVisibleProject}
      setModalVisible={setModalVisibleProject}
    >
      <h2 className="text-center">{Translate("addProject", language)}</h2>
      <Input
        value={projectName}
        setValue={setProjectName}
        autoFocus
        placeholder={Translate("projectName", language)}
        onKeyDown={onKeyDown}
      />
      <div className="container_btn_row direction">
        <Button
          label={Translate("add", language)}
          customStyle={{ width: "40%" }}
          isLoading={isLoading}
          onClick={handleAddProject}
          disabled={disableAddProject}
        />
        <Button
          label={Translate("cancel", language)}
          customStyle={{ width: "40%" }}
          onClick={closeAddProjectModal}
          type="SECONDARY"
        />
      </div>
    </Modal>
  );
};

export default AddProjectModal;
