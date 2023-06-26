import React, { useState } from "react";
import AppBar from "../components/appBar";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import PersonalInformation from "../components/personalInformation";
import AccessExcel from "../components/accessExcel";
import AccessLocation from "../components/accessLocation";
import SelectProjectToUser from "../components/selectProjectToUser";
import { Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import "./statusMember.css";

const StatusMember = () => {
  const { currentPhoneNumber } = useParams();
  const [userCurrentPhone, setUserCurrentPhone] = useState(currentPhoneNumber);
  const [isCollapseLocation, setIsCollapseLocation] = useState(false);
  const [isCollapseProject, setIsCollapseProject] = useState(false);
  const { users } = useSelector((state) => state.users);

  const userCurrent = users.filter(
    (user) => user.phone_number === userCurrentPhone
  )[0];

  const CustomCollapse = ({ label, content, type = "location" }) => {
    const { I18nManager } = useSelector((state) => state.i18n);

    const toggleCollapse = () =>
      type === "location"
        ? setIsCollapseLocation((isCollapse) => !isCollapse)
        : setIsCollapseProject((isCollapse) => !isCollapse);

    const className = {
      collapse: `collapse ${I18nManager.isRTL ? "rtl" : "ltr"}`,
    };

    return (
      <>
        <div className={className.collapse} onClick={toggleCollapse}>
          <span>{label}</span>
          <span style={{ color: "#f6921e" }}>
            {(type === "location" ? isCollapseLocation : isCollapseProject) ? (
              <ExpandLess fontSize="large" />
            ) : (
              <ExpandMore fontSize="large" />
            )}
          </span>
        </div>
        <Collapse
          in={type === "location" ? isCollapseLocation : isCollapseProject}
        >
          {content()}
        </Collapse>
      </>
    );
  };

  return (
    <div className="status-member">
      <AppBar
        label={userCurrent.first_name + " " + userCurrent.last_name}
        type="back"
      />
      <div>
        <PersonalInformation
          userCurrent={userCurrent}
          setUserCurrentPhone={setUserCurrentPhone}
        />
        <AccessExcel userCurrent={userCurrent} />
        <AccessLocation
          userCurrent={userCurrent}
          CustomCollapse={CustomCollapse}
        />
        <SelectProjectToUser
          userCurrent={userCurrent}
          CustomCollapse={CustomCollapse}
        />
      </div>
    </div>
  );
};

export default StatusMember;
