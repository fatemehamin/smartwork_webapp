import React, { useEffect, useState, useRef } from "react";
import Input from "../components/Input";
import AppBar from "../components/AppBar";
import { useParams } from "react-router-dom";
// import Icon from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from "react-redux";
import msgError from "../utils/msgError";
import LocationCheckBox from "../components/checkBox";
import {
  accessExcel,
  addProjectToEmployee,
  deleteProjectFromEmployee,
  editEmployee,
  getEmployeeLocation,
  getProject,
} from "../redux/action/managerAction";
import {
  PersonOutlineOutlined,
  WorkOutlineOutlined,
  EmailOutlined,
  LockOutlined,
} from "@mui/icons-material";

import {
  Grid,
  InputAdornment,
  styled,
  Collapse,
  Radio,
  RadioGroup,
  FormControl,
  Switch,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  KeyboardArrowDown,
  KeyboardArrowRight,
  Close,
} from "@mui/icons-material";
import Button from "../components/Button";
// import TextInput from '../components/customTextInput';
// import SwitchButton from '../components/switchButton';
// import Collapsible from 'react-native-collapsible';
// import LocationCheckBox from '../components/checkBox';
// import Button from '../components/customButton';
// import msgError from '../utils/msgError';
// import Spinner from '../components/spinner';
// import Chip from '../components/chip';

export default () => {
  const { currentPhoneNumber } = useParams();
  const [employeeCurrentPhone, setEmployeeCurrentPhone] =
    useState(currentPhoneNumber);
  const stateManager = useSelector((state) => state.managerReducer);
  let findCurrent = stateManager.employees.filter(
    (employee) => employee.phone_number == employeeCurrentPhone
  );
  const employeeCurrent =
    findCurrent.length == 0 ? stateManager.employees[0] : findCurrent[0];
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProject());
  }, [employeeCurrent, employeeCurrentPhone]);

  return (
    <>
      <AppBar
        label={employeeCurrent.first_name + " " + employeeCurrent.last_name}
        type="back"
      />
      <div>
        <PersonalInformation
          employeeCurrent={employeeCurrent}
          dispatch={dispatch}
          setEmployeeCurrentPhone={setEmployeeCurrentPhone}
          stateManager={stateManager}
        />
        <Excel
          stateManager={stateManager}
          employeeCurrent={employeeCurrent}
          dispatch={dispatch}
        />
        <Location
          stateManager={stateManager}
          employeeCurrent={employeeCurrent}
          dispatch={dispatch}
        />
        <Project
          stateManager={stateManager}
          employeeCurrent={employeeCurrent}
          dispatch={dispatch}
        />
      </div>
      {/* <Spinner isLoading={stateManager.isLoading} /> */}
    </>
  );
};
//--------------------------------------------- Custom Collapse ------------------------------------------------//
const CustomCollapse = ({ label, content }) => {
  const [isCollapse, setIsCollapse] = useState(false);
  return (
    <>
      <div style={styles.Collapse} onClick={() => setIsCollapse(!isCollapse)}>
        <span>{label}</span>
        <span style={{ color: "#f6921e" }}>
          {isCollapse ? (
            <KeyboardArrowDown fontSize="large" />
          ) : (
            <KeyboardArrowRight fontSize="large" />
          )}
        </span>
      </div>
      <Collapse in={isCollapse}>{content()}</Collapse>
    </>
  );
};
//------------------------------------------------- main title -------------------------------------------------//
const MainTitle = ({ title }) => <div style={styles.mainTitle}>{title}</div>;
//-------------------------------------------- personal information --------------------------------------------//
const PersonalInformation = ({
  employeeCurrent,
  dispatch,
  setEmployeeCurrentPhone,
  stateManager,
}) => {
  const [firstName, setFirstName] = useState(employeeCurrent.first_name);
  const [lastName, setLastName] = useState(employeeCurrent.last_name);
  const [email, setEmail] = useState(employeeCurrent.email);
  const [callingCode, setCallingCode] = useState(
    employeeCurrent.calling_code.slice(2)
  );
  const [country, setCountry] = useState(
    employeeCurrent.calling_code.slice(0, 2)
  );
  const [isEdit, setIsEdit] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(employeeCurrent.phone_number);
  useEffect(() => {
    setIsEdit(
      firstName !== employeeCurrent.first_name ||
        lastName !== employeeCurrent.last_name ||
        email !== employeeCurrent.email ||
        phoneNumber !== employeeCurrent.phone_number ||
        country.toUpperCase() + callingCode !== employeeCurrent.calling_code
    );
  }, [firstName, lastName, email, phoneNumber, callingCode]);
  return (
    <div style={styles.sectionContainer}>
      <MainTitle title="Personal Information" />
      <Input
        value={firstName}
        setValue={setFirstName}
        label="First Name"
        placeholder="First Name"
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={lastName}
        setValue={setLastName}
        label="Last name"
        placeholder="Last name"
        Icon={PersonOutlineOutlined}
      />
      <Input
        value={email}
        setValue={setEmail}
        label="Email"
        placeholder="Email"
        Icon={EmailOutlined}
        msgError={isEdit && msgError.email(email)}
      />
      <Input
        value={phoneNumber}
        setValue={setPhoneNumber}
        label="Phone Number"
        placeholder="Phone Number"
        country={country}
        setCountry={setCountry}
        callingCode={callingCode}
        setCallingCode={setCallingCode}
        // msgError={stateAuth.isError ? stateAuth.error.phoneNumberError : ""}
      />
      {isEdit && (
        <div style={styles.buttonContainer}>
          <Button
            label="Cancel"
            customStyle={{ width: "40%" }}
            type="SECONDARY"
            onClick={() => {
              setIsEdit(false);
              setFirstName(employeeCurrent.first_name);
              setLastName(employeeCurrent.last_name);
              setEmail(employeeCurrent.email);
              setPhoneNumber(employeeCurrent.phone_number);
              setCountry(employeeCurrent.calling_code.slice(0, 2));
              setCallingCode(employeeCurrent.calling_code.slice(2));
            }}
          />
          <Button
            label="Confirm"
            customStyle={{ width: "40%" }}
            isLoading={stateManager.isLoading}
            onClick={() => {
              !msgError.email(email) &&
                dispatch(
                  editEmployee(
                    firstName,
                    lastName,
                    email,
                    callingCode,
                    country.toUpperCase(),
                    employeeCurrent.phone_number,
                    phoneNumber,
                    setIsEdit,
                    setEmployeeCurrentPhone
                  )
                );
            }}
          />
        </div>
      )}
    </div>
  );
};
//--------------------------------------------------- Excel ----------------------------------------------------//
const Excel = ({ stateManager, employeeCurrent, dispatch }) => {
  const [isChecked, setIsChecked] = useState(
    (employeeCurrent.financial_group == true ||
      employeeCurrent.financial_group == "true") &&
      true
  );
  return (
    <div style={styles.sectionContainer}>
      <MainTitle title="Excel" />
      <div style={styles.sectionPart}>
        <div style={styles.SectionDescription}>Access Excel</div>
        <Switch
          checked={isChecked}
          disabled={stateManager.isLoading}
          color="secondary"
          onChange={(e) =>
            dispatch(
              accessExcel(
                employeeCurrent.phone_number,
                !isChecked,
                setIsChecked
              )
            )
          }
        />
      </div>
    </div>
  );
};
//------------------------------------------------- Location ---------------------------------------------------//
const Location = ({ stateManager, employeeCurrent, dispatch }) => {
  useEffect(() => {
    dispatch(getEmployeeLocation(employeeCurrent.phone_number));
  }, []);
  return (
    <div style={{ ...styles.sectionContainer, alignItems: "flex-start" }}>
      <MainTitle title="Location" />
      <CustomCollapse
        label="Add location to member."
        content={() =>
          stateManager.locations.map((location, index) => (
            <LocationCheckBox
              name={location.location_name}
              key={index}
              toggle={
                employeeCurrent.location != undefined &&
                employeeCurrent.location.filter(
                  (loc) => loc.location_name == location.location_name
                ).length > 0
              }
              employeeCurrentPhone={employeeCurrent.phone_number}
              isLoading={stateManager.isLoading}
            />
          ))
        }
      />
    </div>
  );
};
//-------------------------------------------------- Project ---------------------------------------------------//
const Project = ({ stateManager, employeeCurrent, dispatch }) => {
  const pickerItems = stateManager.projects.filter((pikerItem) => {
    for (const projectEmployee of employeeCurrent.project_list) {
      if (projectEmployee.project_name == pikerItem.project_name) {
        return false;
      }
    }
    return true;
  });
  const EmployeeProjects = () => {
    return employeeCurrent.project_list.length ? (
      employeeCurrent.project_list.map((project, index) => (
        <div key={index} style={styles.filedProjectEmployee}>
          <span
          // numberOfLines={1}
          >
            {project.project_name}
          </span>
          <span style={{ color: "red" }}>
            <Close
              onClick={() =>
                dispatch(
                  deleteProjectFromEmployee(
                    employeeCurrent.phone_number,
                    project.project_name
                  )
                )
              }
            />
          </span>
        </div>
      ))
    ) : (
      <span style={styles.noProjectFiled}>Add project to member ...</span>
    );
  };
  return (
    <div style={styles.sectionContainer}>
      <MainTitle title="Project" />
      <CustomCollapse
        label="Add project to member."
        content={() => (
          <div style={styles.project}>
            <div style={styles.containerSelectedProjectEmployee}>
              <EmployeeProjects />
            </div>
            <div style={styles.pickerItem}>
              {pickerItems.length > 0 ? (
                pickerItems.map((project, index) => (
                  <p
                    onClick={() =>
                      dispatch(
                        addProjectToEmployee(
                          employeeCurrent.phone_number,
                          project.project_name
                        )
                      )
                    }
                    key={index}
                    style={styles.textPicker}
                  >
                    {project.project_name}
                  </p>
                ))
              ) : (
                <p style={styles.noProjectDefine}>
                  Please define new projects.
                </p>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};
const styles = {
  sectionContainer: {
    backgroundColor: "#fff",
    width: "100%",
    marginBottom: 10,
    boxShadow: "-2px 3px 12px -5px rgba(0,0,0,0.31)",
    padding: "15px 0px",
  },
  mainTitle: {
    textAlign: "left",
    margin: "0px 20px",
    fontWeight: "bold",
    color: "#176085",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-evenly",
    alignSelf: "stretch",
  },
  sectionPart: {
    display: "flex",
    alignSelf: "stretch",
    justifyContent: "space-between",
    margin: "0px 20px",
    marginTop: 10,
  },
  containerSelectedProjectEmployee: {
    flexWrap: "wrap",
    display: "flex",
    borderBottom: "2px solid #f6921e",
    width: 320,
    padding: "10px 0px",
  },
  filedProjectEmployee: {
    borderRadius: 50,
    backgroundColor: "#f6921e60",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    padding: "0px 10px",
    margin: "0px 5px",
    marginTop: 10,
  },
  noProjectFiled: {
    color: "#f6921e",
    paddingVertical: 10,
    marginTop: 10,
  },
  pickerItem: {
    width: 330,
  },
  textPicker: {
    borderBottom: "1px solid #ddd",
    color: "#000",
    padding: "20px 0px",
    width: "100%",
    textAlign: "center",
    flexWrap: "wrap",
  },
  noProjectDefine: {
    color: "#777",
    textAlign: "center",
    marginTop: 5,
  },
  project: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  Collapse: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: "0px 30px",
  },
};
