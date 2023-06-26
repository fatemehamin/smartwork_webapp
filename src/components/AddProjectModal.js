import React, { useState } from "react";
import Input from "./input";
import Modal from "./modal";
import Button from "./button";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import { Translate } from "../features/i18n/translate";
import { addProjects } from "../features/projects/action";

const AddProjectModal = ({ modalVisibleProject, setModalVisibleProject }) => {
  const [projectName, setProjectName] = useState("");
  const { isLoading } = useSelector((state) => state.users);
  const { language, I18nManager } = useSelector((state) => state.i18n);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const closeAddProjectModal = () => setModalVisibleProject(false);

  const handleAddProject = () => {
    dispatch(addProjects(projectName))
      .unwrap()
      .then((res) => {
        setProjectName("");
        setModalVisibleProject(false);
        openSnackbar(Translate("NewProjectAddedSuccessfully", language));
      })
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message.slice(-3) === "403"
            ? Translate("projectExists", language)
            : error.message
        );
      });
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
      />
      <div className={`container_btn_row ${I18nManager.isRTL ? "rtl" : "ltr"}`}>
        <Button
          label={Translate("add", language)}
          customStyle={{ width: "40%" }}
          isLoading={isLoading}
          onClick={handleAddProject}
          disabled={!projectName.trim()}
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
