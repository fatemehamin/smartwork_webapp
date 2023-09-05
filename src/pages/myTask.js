import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchIsNewMsg } from "../features/msg/action";
import { fetchIsNewLog, fetchTasks } from "../features/tasks/action";
import { setMyTaskActiveTab } from "../features/config/configSlice";
import { useSnackbar } from "react-simple-snackbar";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import TabEntryAndExit from "./tabEntryAndExit";
import TabTasks from "./tabTasks";
import TabCartable from "./tabCartable";
import { Translate } from "../features/i18n/translate";

const MyTask = () => {
  const { isNewMsg } = useSelector((state) => state.msg);
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
          { title: "cartable", isBadge: isNewMsg || isNewLog },
        ];

  useEffect(() => {
    dispatch(fetchIsNewMsg());
    dispatch(fetchIsNewLog());
    dispatch(fetchTasks()).unwrap().catch(_error);
  }, [myTaskActiveTab]);

  const _error = (error) =>
    openSnackbar(
      error.code === "ERR_NETWORK"
        ? Translate("connectionFailed", language)
        : error.message
    );

  return (
    <>
      <AppBar label={type === "boss" ? "myTasks" : "Smart Work"} />
      <Tabs activeTab={myTaskActiveTab} tabs={tabs} onSwitchTab={onSwitchTab} />
      {myTaskActiveTab === "entryAndExit" ? (
        <TabEntryAndExit />
      ) : myTaskActiveTab === "tasks" ? (
        <TabTasks />
      ) : (
        <TabCartable />
      )}
    </>
  );
};

export default MyTask;
