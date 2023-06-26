import React, { useState, useEffect } from "react";
import FloatingButton from "../components/floatingButton";
import AddUserModal from "../components/addUserModal";
import AddProjectModal from "../components/addProjectModal";
import CardUser from "../components/cardUser";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { fetchUsers } from "../features/users/action";
import { Translate } from "../features/i18n/translate";
import "./users.css";

const Users = () => {
  const [modalVisibleUser, setModalVisibleUser] = useState(false);
  const [modalVisibleProject, setModalVisibleProject] = useState(false);
  const { users } = useSelector((state) => state.users);
  const { language } = useSelector((state) => state.i18n);
  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers())
      .unwrap()
      .catch((error) => {
        openSnackbar(
          error.code === "ERR_NETWORK"
            ? Translate("connectionFailed", language)
            : error.message
        );
      });
  }, []);

  const getUsersCard = () =>
    users
      // .sort(a => (a.now_active_project == 'nothing' ? 1 : -1))
      .map((user, index) => {
        return (
          <CardUser
            key={index}
            firstName={user.first_name}
            lastName={user.last_name}
            phoneNumber={user.phone_number}
            nowActiveProject={user.now_active_project}
          />
        );
      });

  return (
    <>
      <div className="users-container">{getUsersCard()}</div>
      <AddUserModal
        modalVisibleUser={modalVisibleUser}
        setModalVisibleUser={setModalVisibleUser}
      />
      <AddProjectModal
        modalVisibleProject={modalVisibleProject}
        setModalVisibleProject={setModalVisibleProject}
      />
      {!(modalVisibleUser || modalVisibleProject) && (
        <FloatingButton
          setModalVisibleProject={setModalVisibleProject}
          setModalVisibleEmployee={setModalVisibleUser}
        />
      )}
    </>
  );
};

export default Users;
