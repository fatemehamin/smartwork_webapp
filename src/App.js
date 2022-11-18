import React, { useEffect } from "react";
// import 'react-native-gesture-handler';
// import {NavigationContainer, DefaultTheme} from '@react-navigation/native';
// import Navigation from './src/navigation';
// import { Provider } from "react-redux";
// import { store } from "./redux/store/index";
// import SplashScreen from 'react-native-splash-screen';
import "./App.css";
import Login from "./pages/login";
import Employee from "./pages/employee";

// const MyTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     background: '#f5f5f5',
//   },
// };

const App = () => {
  // //Hide Splash screen on app load.
  // useEffect(() => {
  //   SplashScreen.hide();
  // });
  return (
    // <Provider store={store}>
    <div className="App">
      <Employee />
    </div>
    // </Provider>
  );
};

export default App;
