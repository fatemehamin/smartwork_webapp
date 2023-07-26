import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchIsNewMsg, fetchMsg } from "../features/msg/action";
import { fetchLeaveRequests } from "../features/leaveRequests/action";
import { fetchUsers } from "../features/users/action";
import { fetchIsNewLog, fetchTasksLog } from "../features/tasks/action";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import TabEntryAndExit from "./tabEntryAndExit";
import TabTasks from "./tabTasks";
import TabCartable from "./tabCartable";

const MyTask = () => {
  const [activeFilter, setActiveFilter] = useState("entryAndExit");
  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const { isNewMsg } = useSelector((state) => state.msg);
  const { type } = useSelector((state) => state.auth);
  const { lastEntry, isNewLog } = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIsNewMsg());
    dispatch(fetchIsNewLog());
    if (activeFilter === "cartable") {
      dispatch(fetchLeaveRequests());
      dispatch(fetchMsg());
      dispatch(fetchUsers());
      dispatch(fetchTasksLog());
    }
    if (isFirstLoading) {
      setActiveFilter(lastEntry ? "tasks" : "entryAndExit");
      setIsFirstLoading(false);
    }
  }, [lastEntry, activeFilter]);

  return (
    <>
      <AppBar label={type === "boss" ? "myTasks" : "Smart Work"} />
      <Tabs
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        tabs={
          type === "boss"
            ? [{ title: "entryAndExit" }, { title: "tasks" }]
            : [
                { title: "entryAndExit" },
                { title: "tasks" },
                { title: "cartable", isBadge: isNewMsg || isNewLog },
              ]
        }
      />
      {activeFilter === "entryAndExit" ? (
        <TabEntryAndExit setActiveFilter={setActiveFilter} />
      ) : activeFilter === "tasks" ? (
        <TabTasks setActiveFilter={setActiveFilter} />
      ) : (
        <TabCartable activeFilter={activeFilter} />
      )}
    </>
  );
};

export default MyTask;
