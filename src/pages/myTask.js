import React, { useEffect, useCallback, useState } from "react";
import Task from "../components/Task";
import "./myTask.css";
import AppBar from "../components/AppBar";
import {
  getProject,
  dailyReport,
  entry,
  exit,
  location,
} from "../redux/action/employeeAction";
// import { getEmployee } from "../redux/action/managerAction";
import FloatingButton from "../components/floatingButton";
import Modal from "../components/modal";
import Input from "../components/Input";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "react-simple-snackbar";

// import Geolocation from "react-native-geolocation-service";
// import MapView from "react-native-maps";
// import Permission, { PERMISSIONS_TYPE } from "../utils/AppPermissions";
// import checkLocation from "../utils/checkLocation";
// import Spinner from "../components/spinner";
// import NetInfo from '@react-native-community/netinfo';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default () => {
  const employeeState = useSelector((state) => state.employeeReducer);
  const authState = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [openSnackbar, closeSnackbar] = useSnackbar();
  const [refreshing, setRefreshing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isEntry, setIsEntry] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tasks");
  const styles = {
    // entryExit: { borderTopColor: isEntry ? "red" : "#008800" },
    entryExitText: { color: isEntry ? "red" : "#008800" },
  };
  const [dailyReportToday, setDailyReportToday] = useState(
    employeeState.dailyReport
  );
  //   const isGrantedFunction = () => {
  //     Geolocation.getCurrentPosition(
  //       (position) => {
  //         // when location add for each employee
  //         employeeState.locations.length > 0
  //           ? employeeState.locations.filter((location) =>
  //               checkLocation(
  //                 {
  //                   latitude: position.coords.latitude,
  //                   longitude: position.coords.longitude,
  //                 },
  //                 location,
  //                 location.radius
  //               )
  //             ).length > 0
  //             ? exitEntryHandler()
  //             : (Alert.alert(
  //                 "LOCATION",
  //                 "You are not in a defined location. If you are in location, please restart your location."
  //               ),
  //               setIsLoadingButton(false))
  //           : exitEntryHandler();
  //       },
  //       (err) => {
  //         console.log("location check err", err);
  //         setIsLoadingButton(false);
  //       }
  //     );
  //   };
  //   const isDeniedFunction = () => {
  //     Alert.alert("location permission denied");
  //     setIsLoadingButton(false);
  //   };
  //   const exitEntryHandler = () => {
  //     const nowTime = new Date().getTime();
  //     isEntry
  //       ? employeeState.currentTask.start // when exit all task disable
  //         ? dispatch(
  //             exit(
  //               nowTime,
  //               setIsEntry,
  //               employeeState.currentTask.name,
  //               setIsLoadingButton
  //             )
  //           )
  //         : dispatch(exit(nowTime, setIsEntry, undefined, setIsLoadingButton))
  //       : dispatch(entry(nowTime, setIsEntry, setIsLoadingButton));
  //   };
  const ExitEntry = () => (
    <div
      className="exitEntry"
      // style={styles.entryExit}
      // disabled={isLoadingButton}
      // onLongPress={() => {
      //   employeeState.locations.length > 0
      //     ? (setIsLoadingButton(true),
      //       exitEntryHandler,
      //       Permission(
      //         PERMISSIONS_TYPE.location,
      //         isGrantedFunction,
      //         isDeniedFunction,
      //         setIsLoadingButton
      //       ))
      //     : exitEntryHandler();
      // }}
    >
      <p className="exitEntryText" style={styles.entryExitText}>
        {isEntry ? "E     X     I     T" : "E    N    T    R    Y"}
      </p>
    </div>
  );
  // const onRefresh = useCallback(() => {
  //   // setRefreshing(false);
  //   dispatch(getProject());
  //   dispatch(getEmployee());
  //   dispatch(location(authState.user.phoneNumber));
  //   NetInfo.fetch().then((netInfo) => {
  //     setIsConnected(netInfo.isConnected);
  //   });
  // }, []);
  useEffect(() => {
    console.log(employeeState.isError, employeeState.error);
    //   onRefresh();
    //   setIsEntry(employeeState.lastEntry ? true : false);
    setDailyReportToday(employeeState.dailyReport);
    openSnackbar("u");
    employeeState.isError && openSnackbar(employeeState.error);
  }, [
    employeeState.dailyReport,
    employeeState.lastEntry,
    employeeState.isError,
  ]);
  const getTasks = () => {
    // return employeeState.projects !=== null ? (
    //   employeeState.projects.map((project, index) => (
    <Task
      name={"ddd"}
      initialDuration={0}
      currentTask={{
        name: "ddd",
        start: 1668780042388,
      }}
      //  name={project.project_name}
      //  initialDuration={project.duration}
      //  currentTask={employeeState.currentTask}
      //  key={index}
      //  lastEntry={employeeState.lastEntry}
    />;
    // ))
    // ) : (
    // <Text className='text'>
    //   The manager has not defined a project for you at this time.
    // </Text>
    // );
  };
  return (
    <>
      <AppBar label={authState.type === "boss" ? "My Tasks" : "Smart Work"} />
      <div className="filterContainer">
        <div
          className={`filter ${activeFilter === "Tasks" && "activeFilter"}`}
          onClick={() => setActiveFilter("Tasks")}
        >
          <p className="filterText">Tasks</p>
        </div>
        <div
          className={`filter ${activeFilter === "Map" && "activeFilter"}`}
          onClick={() => setActiveFilter("Map")}
        >
          <p className="filterText">Map</p>
        </div>
      </div>
      {activeFilter === "Tasks" ? (
        // !isConnected ? (
        //   <ScrollView
        // className='error'
        //     refreshControl={
        //       <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        //      }>
        //      <Icon name="undo" size={30} onPress={onRefresh} />
        //      <Text>connection failed</Text>
        //   </ScrollView>
        // ) : (
        <>
          <div
            className="employee"
            // showsVerticalScrollIndicator={false}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
          >
            {getTasks()}
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
            <Task
              name={"dd"}
              initialDuration={0}
              currentTask={{
                name: "ddd",
                start: 1668780042388,
              }}
            />
          </div>
          <FloatingButton
            type="DailyReport"
            setModalVisibleProject={setModalVisible}
          />
          <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
            <h2 className="labelModal">Today Report</h2>
            <Input
              value={dailyReportToday}
              setValue={setDailyReportToday}
              placeholder="what's doing today?"
              autoFocus
              multiline
            />
            <div className="buttonsContainer">
              <Button
                label="Cancel"
                customStyle={{ width: "40%" }}
                onClick={() => {
                  setModalVisible(false);
                  setDailyReportToday(employeeState.dailyReport);
                }}
                type="SECONDARY"
              />
              <Button
                label="OK"
                customStyle={{ width: "40%" }}
                onClick={() => {
                  dispatch(
                    dailyReport(
                      new Date().toISOString().slice(0, 10),
                      dailyReportToday,
                      setModalVisible,
                      !modalVisible
                    )
                  );
                }}
              />
            </div>
          </Modal>
        </>
      ) : (
        <div className="map">map</div>
        // <MapView
        // className="map"
        //   initialRegion={{
        //     latitude: 35.720228,
        //     longitude: 51.39396,
        //     latitudeDelta: 0.0621,
        //     longitudeDelta: 0.0421,
        //   }}
        //   showsUserLocation={true}
        //   showsMyLocationButton={true}
        //   focusable={true}
        // ></MapView>
      )}
      <ExitEntry />
      {/* <Spinner isLoading={isLoadingButton ? true : employeeState.isLoading} /> */}
    </>
  );
};
