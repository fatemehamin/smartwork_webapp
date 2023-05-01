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
import { Translate } from "../i18n";
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
  const { language, I18nManager } = useSelector((state) => state.configReducer);

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
        language={language}
        isRTL={I18nManager.isRTL}
      />
      <AddProjectModal
        modalVisibleProject={modalVisibleProject}
        setModalVisibleProject={setModalVisibleProject}
        dispatch={dispatch}
        stateManager={stateManager}
        setIsPress={setIsPress}
        language={language}
        isRTL={I18nManager.isRTL}
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
  language,
  openSnackbar,
  isRTL,
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
      <h2 style={styles.textCenter}>{Translate("memberProfile", language)}</h2>
      <Input
        label={Translate("firstName", language)}
        placeholder={Translate("firstName", language)}
        Icon={PersonOutlineOutlined}
        value={firstName}
        setValue={setFirstName}
      />
      <Input
        label={Translate("lastName", language)}
        placeholder={Translate("lastName", language)}
        Icon={PersonOutlineOutlined}
        value={lastName}
        setValue={setLastName}
      />
      <Input
        label={Translate("phoneNumber", language)}
        placeholder={Translate("phoneNumber", language)}
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
        label={Translate("email", language)}
        placeholder={Translate("email", language)}
        Icon={EmailOutlined}
        value={email}
        setValue={setEmail}
        msgError={isPress && Translate(msgError.email(email), language)}
      />
      <Input
        label={Translate("password", language)}
        placeholder={Translate("password", language)}
        repeatPassword
        Icon={LockOutlined}
        value={password}
        setValue={setPassword}
        type="password"
        msgError={isPress && Translate(msgError.password(password), language)}
      />
      <Input
        label={Translate("repeatPassword", language)}
        placeholder={Translate("repeatPassword", language)}
        Icon={LockOutlined}
        type="password"
        value={rePassword}
        setValue={setRePassword}
        msgError={
          isPress &&
          Translate(msgError.rePassword(rePassword, password), language)
        }
      />
      <div style={styles.containerButton(isRTL)}>
        <Button
          label={Translate("add", language)}
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
        <Button
          label={Translate("cancel", language)}
          customStyle={{ width: "40%" }}
          onClick={() => setModalVisibleEmployee(!modalVisibleEmployee)}
          type="SECONDARY"
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
  language,
  isRTL,
}) => {
  const [projectName, setProjectName] = useState("");
  return (
    <Modal
      modalVisible={modalVisibleProject}
      setModalVisible={setModalVisibleProject}
    >
      <h2 style={styles.textCenter}>{Translate("addProject", language)}</h2>
      <Input
        value={projectName}
        setValue={setProjectName}
        autoFocus
        placeholder={Translate("projectName", language)}
      />
      <div style={styles.containerButton(isRTL)}>
        <Button
          label={Translate("add", language)}
          customStyle={{ width: "40%" }}
          isLoading={stateManager.isLoading}
          onClick={() => {
            setIsPress(true);
            dispatch(addProject(projectName, setProjectName, setIsPress));
            setModalVisibleProject(!modalVisibleProject);
          }}
        />
        <Button
          label={Translate("cancel", language)}
          customStyle={{ width: "40%" }}
          onClick={() => setModalVisibleProject(!modalVisibleProject)}
          type="SECONDARY"
        />
      </div>
    </Modal>
  );
};

const styles = {
  textCenter: { textAlign: "center" },
  containerButton: (isRTL) => ({
    direction: isRTL ? "rtl" : "ltr",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
    display: "flex",
  }),
};

export default Manager;
