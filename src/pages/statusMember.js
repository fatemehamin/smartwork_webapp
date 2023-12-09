import React from "react";
import AppBar from "../components/appBar";
import PersonalInformation from "../components/personalInformation";
import PermissionSwitch from "../components/permissionSwitch";
import AccessLocation from "../components/accessLocation";
import SelectProjectToUser from "../components/selectProjectToUser";
import SelectShiftToUser from "../components/selectShiftToUser";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import "./statusMember.css";

const StatusMember = () => {
  const { currentId } = useParams();

  const { users } = useSelector((state) => state.users);

  const userCurrent = users.filter((user) => user.id == currentId)[0];

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
        <AccessLocation userCurrent={userCurrent} />
        <PermissionSwitch
          userCurrent={userCurrent}
          typePermission="autoExit"
          initCheck={userCurrent.permissionAutoExit}
          label="autoExit"
          description="autoExitDescription"
        />
        <SelectProjectToUser userCurrent={userCurrent} />
        <SelectShiftToUser userCurrent={userCurrent} />
      </div>
    </div>
  );
};

export default StatusMember;
