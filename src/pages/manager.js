import React from "react";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import TabUsers from "./tabUsers";
import TabCartable from "./tabCartable";
import { useDispatch, useSelector } from "react-redux";
import { setManagerActiveTab } from "../features/config/configSlice";

const Manager = () => {
  const { managerActiveTab } = useSelector((state) => state.config);
  const { isNewMsg } = useSelector((state) => state.msg);
  const { isNewLeave } = useSelector((state) => state.leaveRequest);

  const dispatch = useDispatch();

  const onSwitchTab = (activeTab) => dispatch(setManagerActiveTab(activeTab));

  return (
    <div>
      <AppBar label="Smart Work" />
      <Tabs
        tabs={[
          { title: "users" },
          { title: "cartable", isBadge: isNewMsg || isNewLeave },
        ]}
        activeTab={managerActiveTab}
        onSwitchTab={onSwitchTab}
      />
      {managerActiveTab === "users" ? <TabUsers /> : <TabCartable />}
    </div>
  );
};

export default Manager;
