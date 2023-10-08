import React, { useState } from "react";
import AppBar from "../components/appBar";
import PersonalInformation from "../components/personalInformation";
import PermissionSwitch from "../components/permissionSwitch";
import AccessLocation from "../components/accessLocation";
import SelectProjectToUser from "../components/selectProjectToUser";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Collapse } from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import "./statusMember.css";

const StatusMember = () => {
  const { currentId } = useParams();

  const [isCollapseLocation, setIsCollapseLocation] = useState(false);
  const [isCollapseProject, setIsCollapseProject] = useState(false);

  const { users } = useSelector((state) => state.users);

  const userCurrent = users.filter((user) => user.id == currentId)[0];

  const CustomCollapse = ({ label, content, type = "location" }) => {
    const toggleCollapse = () =>
      type === "location"
        ? setIsCollapseLocation((isCollapse) => !isCollapse)
        : setIsCollapseProject((isCollapse) => !isCollapse);

    return (
      <>
        <div className="collapse direction" onClick={toggleCollapse}>
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
        <PersonalInformation userCurrent={userCurrent} />
        <PermissionSwitch
          userCurrent={userCurrent}
          typePermission="accessExcel"
          initCheck={userCurrent.financial_group}
          label="excel"
          description="accessExcel"
        />
        <PermissionSwitch
          userCurrent={userCurrent}
          typePermission="autoExit"
          initCheck={userCurrent.permissionAutoExit}
          label="autoExit"
          description="autoExitDescription"
        />
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
