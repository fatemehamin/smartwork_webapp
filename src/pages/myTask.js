import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchTasks } from "../features/tasks/action";
import { setMyTaskActiveTab } from "../features/config/configSlice";
import { Translate } from "../features/i18n/translate";
import { useSnackbar } from "react-simple-snackbar";
import { fetchLeaveRequests } from "../features/leaveRequests/action";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import TabEntryAndExit from "./tabEntryAndExit";
import TabTasks from "./tabTasks";
import TabCartable from "./tabCartable";

const MyTask = () => {
  const { isNewMsg } = useSelector((state) => state.msg);
  const { isNewLeave } = useSelector((state) => state.leaveRequest);
  const { type } = useSelector((state) => state.auth);
  const { isNewLog } = useSelector((state) => state.tasks);
  const { myTaskActiveTab } = useSelector((state) => state.config);
  const { language } = useSelector((state) => state.i18n);

  const [openSnackbar] = useSnackbar();
  const dispatch = useDispatch();

  const onSwitchTab = (activeTab) => dispatch(setMyTaskActiveTab(activeTab));

  const tabs =
    type === "boss"
      ? [{ title: "entryAndExit" }, { title: "tasks" }]
      : [
          { title: "entryAndExit" },
          { title: "tasks" },
          { title: "cartable", isBadge: isNewMsg || isNewLog || isNewLeave },
        ];

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchTasks()).unwrap().catch(_error);
    dispatch(fetchLeaveRequests()); //
  }, [myTaskActiveTab]);

  const _error = (error) =>
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );

  const admin = type === "boss" || type === "admin";

  return (
    <div>
      <AppBar label={admin ? "myTasks" : "Smart Work"} />
      <Tabs activeTab={myTaskActiveTab} tabs={tabs} onSwitchTab={onSwitchTab} />
      {myTaskActiveTab === "entryAndExit" ? (
        <TabEntryAndExit />
      ) : myTaskActiveTab === "tasks" ? (
        <TabTasks />
      ) : (
        <TabCartable />
      )}
    </div>
  );
};

export default MyTask;
