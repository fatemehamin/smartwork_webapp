import React, { useEffect, useCallback, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
import Task from "../components/Task";
import "./employee.css";
import Grid from "@mui/material/Grid";
// import {
//   getProject,
//   dailyReport,
//   entry,
//   exit,
//   location,
// } from "../redux/action/employeeAction";
// import { getEmployee } from "../redux/action/managerAction";
// import FloatingButton from "../components/floatingButton";
// import Modal from "../components/modal";
// import Button from "../components/customButton";
// import Geolocation from "react-native-geolocation-service";
// import MapView from "react-native-maps";
// import Permission, { PERMISSIONS_TYPE } from "../utils/AppPermissions";
// import checkLocation from "../utils/checkLocation";
// import Spinner from "../components/spinner";

export default () => {
  //   const employeeState = useSelector((state) => state.employeeReducer);
  //   const phoneNumber = useSelector(
  //     (state) => state.authReducer.user.phoneNumber
  //   );
  //   const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isEntry, setIsEntry] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState("Tasks");
  const styles = {
    // entryExit: { borderTopColor: isEntry ? "red" : "#008800" },
    entryExitText: { color: isEntry ? "red" : "#008800" },
  };
  //   const [dailyReportToday, setDailyReportToday] = useState(
  //     employeeState.dailyReport
  //   );
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
      //   style={styles.entryExit}
      //   disabled={isLoadingButton}
      //   onLongPress={() => {
      //     setIsLoadingButton(true);
      //     Permission(
      //       PERMISSIONS_TYPE.location,
      //       isGrantedFunction,
      //       isDeniedFunction,
      //       setIsLoadingButton
      //     );
      //   }}
    >
      <p className="exitEntryText" style={styles.entryExitText}>
        {isEntry ? "E     X     I     T" : "E    N    T    R    Y"}
      </p>
    </div>
  );
  //   const onRefresh = useCallback(() => {
  //     // setRefreshing(false);
  //     dispatch(getProject());
  //     dispatch(getEmployee());
  //     dispatch(location(phoneNumber));
  //   }, []);
  //   useEffect(() => {
  //     dispatch(getProject());
  //     dispatch(getEmployee());
  //     dispatch(location(phoneNumber));
  //     setIsEntry(employeeState.lastEntry ? true : false);
  //     setDailyReportToday(employeeState.dailyReport);
  //   }, [employeeState.dailyReport, employeeState.lastEntry]);
  const getTasks = () => {
    return (
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
      />
    );
    //   employeeState.projects !== null ? (
    //     employeeState.projects.map((project, index) => (
    //       <Task
    //         name={project.project_name}
    //         initialDuration={project.duration}
    //         currentTask={employeeState.currentTask}
    //         key={index}
    //         lastEntry={employeeState.lastEntry}
    //       />
    //     ))
    //   ) : (
    //     <Text style={styles.text}>
    //       The manager has not defined a project for you at this time.
    //     </Text>
    //   );
  };
  return (
    <>
      <div
        className={`filter ${activeFilter == "Tasks" && "activeFilter"}`}
        //   onPress={() => setActiveFilter("Tasks")}
      >
        <p className="filterText">Tasks</p>
      </div>
      <div
        className={`filter ${activeFilter == "Map" && "activeFilter"}`}
        //   style={ activeFilter == "Map" && styles.activeFilter}
        //   onPress={() => setActiveFilter("Map")}
      >
        <p className="filterText">Map</p>
      </div>
      {activeFilter == "Tasks" ? (
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
              //  name={project.project_name}
              //  initialDuration={project.duration}
              //  currentTask={employeeState.currentTask}
              //  key={index}
              //  lastEntry={employeeState.lastEntry}
            />
            <Task
              name={"dd"}
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
            />
            <Task
              name={"dd"}
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
            />
            <Task
              name={"dd"}
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
            />
          </div>
          {/* <FloatingButton isReport setModalVisibleProject={setModalVisible} /> */}
          {/* <Modal modalVisible={modalVisible} setModalVisible={setModalVisible}>
            <Text style={styles.labelModal}>Today Report</Text>
            <TextInput
              placeholder="what's doing today?"
              multiline
              style={styles.reportModal}
              onChangeText={setDailyReportToday}
              value={dailyReportToday}
              placeholderTextColor="#999"
            />
            <View style={styles.buttonsContainer}>
              <Button
                customStyle={{ width: "40%" }}
                label="Cancel"
                type="SECONDARY"
                onPress={() => {
                  setModalVisible(false);
                  setDailyReportToday(employeeState.dailyReport);
                }}
              />
              <Button
                customStyle={{ width: "40%" }}
                label="OK"
                onPress={() => {
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
            </View>
          </Modal> */}
        </>
      ) : (
        <div>map</div>
        // <MapView
        //   style={styles.map}
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
