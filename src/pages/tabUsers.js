import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";
import { FetchImageUsers, fetchUsers } from "../features/users/action";
import { Translate } from "../features/i18n/translate";
import FloatingButton from "../components/floatingButton";
import AddUserModal from "../components/addUserModal";
import AddProjectModal from "../components/addProjectModal";
import CardUser from "../components/cardUser";
import "./tabUsers.css";

const TabUsers = () => {
  const [modalVisibleUser, setModalVisibleUser] = useState(false);
  const [modalVisibleProject, setModalVisibleProject] = useState(false);

  const { users, profileUsers } = useSelector((state) => state.users);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const { language } = useSelector((state) => state.i18n);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers()).unwrap().catch(_error);
    dispatch(FetchImageUsers()).unwrap().catch(_error);
    window.scrollTo(0, 0);
  }, []);

  const _error = (error) => {
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );
  };

  const getUsersCard = () => {
    const idleUsers = users.filter(
      (item) =>
        item.now_active_project === "nothing" &&
        item.phone_number !== phoneNumber
    );

    const busyUsers = users.filter(
      (item) =>
        item.now_active_project !== "nothing" &&
        item.phone_number !== phoneNumber
    );

    const you = users.find((item) => item.phone_number === phoneNumber);

    const compareByName = (a, b) => {
      const nameA = a.last_name.toUpperCase();
      const nameB = b.last_name.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    };

    idleUsers?.sort(compareByName);
    busyUsers?.sort(compareByName);

    const newUsers = [you, ...busyUsers, ...idleUsers];

    return (
      you !== undefined &&
      newUsers.map((user, index) => {
        const profileUser = profileUsers.find((p) => p.id == user.id)?.profile;

        const position = user.is_boss
          ? "boss"
          : user.access_admin
          ? "admin"
          : "";

        return (
          <CardUser
            key={index}
            id={user.id}
            fullName={user.full_name}
            phoneNumber={user.phone_number}
            nowActiveProject={user.now_active_project}
            languageUser={user.language}
            profileUser={profileUser}
            position={position}
          />
        );
      })
    );
  };

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
          setModalVisibleUser={setModalVisibleUser}
          isOneAction={false}
        />
      )}
    </>
  );
};

export default TabUsers;
