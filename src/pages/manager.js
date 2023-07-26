import React, { useEffect, useState } from "react";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import TabUsers from "./tabUsers";
import TabCartable from "./tabCartable";
import { useDispatch, useSelector } from "react-redux";
import { fetchIsNewMsg, fetchMsg } from "../features/msg/action";
import { fetchUsers } from "../features/users/action";
import { fetchTasksLog } from "../features/tasks/action";
import {
  fetchIsNewLeave,
  fetchLeaveRequests,
} from "../features/leaveRequests/action";

const Manager = () => {
  const [activeFilter, setActiveFilter] = useState("users");
  const { isNewMsg } = useSelector((state) => state.msg);
  const { isNewLeave } = useSelector((state) => state.leaveRequest);
  const dispatch = useDispatch();

  useEffect(() => {
    if (activeFilter === "cartable") {
      dispatch(fetchLeaveRequests());
      dispatch(fetchMsg());
      dispatch(fetchUsers());
      dispatch(fetchTasksLog());
    }
    dispatch(fetchIsNewMsg());
    dispatch(fetchIsNewLeave());
  }, [activeFilter]);

  return (
    <>
      <AppBar label="Smart Work" />
      <Tabs
        tabs={[
          { title: "users" },
          { title: "cartable", isBadge: isNewMsg || isNewLeave },
        ]}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      {activeFilter === "users" ? (
        <TabUsers />
      ) : (
        <TabCartable activeFilter={activeFilter} />
      )}
    </>
  );
};

export default Manager;
