// import { Platform, Alert } from "react-native";
// import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";

// const LOCATION_PERMISSION = {
//   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
//   android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
// };

// const WRITE_EXTERNAL_STORAGE = {
//   android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
// };

// const REQUEST_PERMISSION_TYPE = {
//   location: LOCATION_PERMISSION,
//   writeStorage: WRITE_EXTERNAL_STORAGE,
// };

export const PERMISSIONS_TYPE = {
  location: "location",
  writeStorage: "writeStorage",
};

// const requestPermission = (
//   permission,
//   isGrantedFunction,
//   isDeniedFunction,
//   setIsLoading
// ) => {
//   request(permission)
//     .then((granted) => {
//       granted == RESULTS.GRANTED ? isGrantedFunction() : isDeniedFunction();
//     })
//     .catch((error) => {
//       Alert.alert("request permission denied:", error.message);
//       setIsLoading(false);
//     });
// };
export default (type, isGrantedFunction, isDeniedFunction, setIsLoading) => {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      console.log(true);
      // showLocalNewsWithGeolocation();
    } else if (result.state === "prompt") {
      console.log(false);

      // showButtonToEnableLocalNews();
    }
    // Don't do anything if the permission was denied.
  });
  //   const permission = REQUEST_PERMISSION_TYPE[type][Platform.OS];
  //   check(permission)
  //     .then((result) => {
  //       switch (result) {
  //         case RESULTS.UNAVAILABLE:
  //           Alert.alert(
  //             "Unavailable feature",
  //             "This feature is not available on this device."
  //           );
  //           setIsLoading(false);
  //           break;
  //         case RESULTS.DENIED:
  //           requestPermission(
  //             permission,
  //             isGrantedFunction,
  //             isDeniedFunction,
  //             setIsLoading
  //           );
  //           break;
  //         case RESULTS.LIMITED:
  //           Alert.alert(
  //             "permission limited",
  //             "The permission is limited: some actions are possible."
  //           );
  //           setIsLoading(false);
  //           break;
  //         case RESULTS.GRANTED:
  //           isGrantedFunction();
  //           break;
  //         case RESULTS.BLOCKED:
  //           Alert.alert(
  //             "permission denied",
  //             "The permission is denied and not rerequestable anymore."
  //           );
  //           setIsLoading(false);
  //           break;
  //       }
  //     })
  //     .catch((error) => {
  //       Alert.alert("location permission denied:", error.message);
  //       setIsLoading(false);
  //     });
};
