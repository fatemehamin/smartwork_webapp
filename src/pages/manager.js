import React, { useState, useEffect, useRef } from "react";
import AppBar from "../components/AppBar";
import FloatingButton from "../components/floatingButton";
import Input from "../components/Input";
import Modal from "../components/modal";
import Button from "../components/Button";
import msgError from "../utils/msgError";
import EmployeeBar from "../components/employeeBar";
import { useSnackbar } from "react-simple-snackbar";
import { useDispatch, useSelector } from "react-redux";
import {
  PersonOutlineOutlined,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";
import {
  getEmployee,
  addEmployee,
  addProject,
  getProject,
  getLocation,
} from "../redux/action/managerAction";
// import Spinner from '../components/spinner';

const Manager = () => {
  const [modalVisibleEmployee, setModalVisibleEmployee] = useState(false);
  const [modalVisibleProject, setModalVisibleProject] = useState(false);
  const [employeeCurrentPhone, setEmployeeCurrentPhone] = useState("");
  // const [isOpen, setIsOpen] = useState(false);
  const [isPress, setIsPress] = useState(false);
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const dispatch = useDispatch();
  const stateManager = useSelector((state) => state.managerReducer);

  useEffect(() => {
    isPress && stateManager.isError && openSnackbar(stateManager.error);
    dispatch(getEmployee());
    dispatch(getProject());
    dispatch(getLocation());
  }, [isPress]);
  const getEmployeeBars = () =>
    stateManager.employees
      // .sort(a => (a.now_active_project == 'nothing' ? 1 : -1))
      .map((employee, index) => {
        return (
          <EmployeeBar
            key={index}
            firstName={employee.first_name}
            lastName={employee.last_name}
            phoneNumber={employee.phone_number}
            setEmployeeCurrentPhone={setEmployeeCurrentPhone}
            employeeCurrentPhone={employeeCurrentPhone}
            nowActiveProject={employee.now_active_project}
            // floatingButtonOpen={isOpen}
          />
        );
      });
  return (
    <>
      <AppBar label="Smart Work" />
      <div>{getEmployeeBars()}</div>
      <AddEmployeeModal
        modalVisibleEmployee={modalVisibleEmployee}
        setModalVisibleEmployee={setModalVisibleEmployee}
        dispatch={dispatch}
        stateManager={stateManager}
        openSnackbar={openSnackbar}
      />
      <AddProjectModal
        modalVisibleProject={modalVisibleProject}
        setModalVisibleProject={setModalVisibleProject}
        dispatch={dispatch}
        stateManager={stateManager}
        setIsPress={setIsPress}
      />
      {!(modalVisibleEmployee || modalVisibleProject) ? (
        <FloatingButton
          setModalVisibleProject={setModalVisibleProject}
          setModalVisibleEmployee={setModalVisibleEmployee}
          // isOpen={isOpen}
          // setIsOpen={setIsOpen}
        />
      ) : null}
      {/* <Spinner isLoading={stateManager.isLoading} /> */}
    </>
  );
};

//--------------------------------------------- add employee modal --------------------------------------------//
const AddEmployeeModal = ({
  modalVisibleEmployee,
  setModalVisibleEmployee,
  dispatch,
  stateManager,
  openSnackbar,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [callingCode, setCallingCode] = useState("+98");
  const [country, setCountry] = useState("IR");
  const [isPress, setIsPress] = useState(false);
  // useEffect(() => {
  //   isPress && stateManager.isError && openSnackbar(stateManager.error);
  // }, [isPress]);
  return (
    <Modal
      modalVisible={modalVisibleEmployee}
      setModalVisible={setModalVisibleEmployee}
    >
      <h2 style={styles.textCenter}>Member profile</h2>
      <Input
        label="First name"
        placeholder="First name"
        Icon={PersonOutlineOutlined}
        value={firstName}
        setValue={setFirstName}
      />
      <Input
        label="Last name"
        placeholder="Last name"
        Icon={PersonOutlineOutlined}
        value={lastName}
        setValue={setLastName}
      />
      <Input
        label="Phone number"
        placeholder="Phone Number"
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        value={phoneNumber}
        setValue={setPhoneNumber}
        country={country}
        setCountry={setCountry}
        // msgError={
        //   stateManager.isError ? stateManager.error.duplicateEmployeeError : ""
        // }
      />
      <Input
        label="Email"
        placeholder="Email"
        Icon={EmailOutlined}
        value={email}
        setValue={setEmail}
        msgError={isPress && msgError.email(email)}
      />
      <Input
        label="Password"
        placeholder="Password"
        Icon={LockOutlined}
        value={password}
        setValue={setPassword}
        type="password"
        msgError={isPress && msgError.password(password)}
      />
      <Input
        label="Repeat password"
        placeholder="Repeat Password"
        Icon={LockOutlined}
        type="password"
        value={rePassword}
        setValue={setRePassword}
        msgError={isPress && msgError.rePassword(rePassword, password)}
      />
      <div style={styles.containerButton}>
        <Button
          label="Cancel"
          customStyle={{ width: "40%" }}
          onClick={() => setModalVisibleEmployee(!modalVisibleEmployee)}
          type="SECONDARY"
        />
        <Button
          label="Add"
          customStyle={{ width: "40%" }}
          isLoading={stateManager.isLoading}
          disabled={
            !(
              password &&
              rePassword &&
              email &&
              phoneNumber &&
              firstName &&
              lastName
            )
          }
          onClick={() => {
            setIsPress(true);
            !(
              msgError.email(email) ||
              msgError.password(password) ||
              msgError.rePassword(rePassword, password)
            ) &&
              dispatch(
                addEmployee(
                  firstName,
                  lastName,
                  email,
                  password,
                  callingCode,
                  country,
                  phoneNumber,
                  setModalVisibleEmployee,
                  setIsPress,
                  setFirstName,
                  setLastName,
                  setEmail,
                  setPassword,
                  setRePassword,
                  setPhoneNumber
                )
              );
          }}
        />
      </div>
    </Modal>
  );
};
//---------------------------------------------- add project modal --------------------------------------------//
const AddProjectModal = ({
  modalVisibleProject,
  setModalVisibleProject,
  dispatch,
  stateManager,
  setIsPress,
}) => {
  const [projectName, setProjectName] = useState("");
  return (
    <Modal
      modalVisible={modalVisibleProject}
      setModalVisible={setModalVisibleProject}
    >
      <h2 style={styles.textCenter}>Add project</h2>
      <Input
        value={projectName}
        setValue={setProjectName}
        autoFocus
        placeholder="Project Name"
      />
      <div style={styles.containerButton}>
        <Button
          label="Cancel"
          customStyle={{ width: "40%" }}
          onClick={() => setModalVisibleProject(!modalVisibleProject)}
          type="SECONDARY"
        />
        <Button
          label="Add"
          customStyle={{ width: "40%" }}
          isLoading={stateManager.isLoading}
          onClick={() => {
            setIsPress(true);
            dispatch(addProject(projectName, setProjectName, setIsPress));
            setModalVisibleProject(!modalVisibleProject);
          }}
        />
      </div>
    </Modal>
  );
};

const styles = {
  textCenter: { textAlign: "center" },
  containerButton: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    display: "flex",
  },
};

export default Manager;
