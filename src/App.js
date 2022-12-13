import React, { useEffect } from "react";
import Routers from "./services/Routers";
import "./App.css";
import { Provider } from "react-redux";
import { store } from "./redux/store/index";
import SnackbarProvider from "react-simple-snackbar";
// import SplashScreen from 'react-native-splash-screen';

export default () => {
  // //Hide Splash screen on app load.
  // useEffect(() => {
  //   SplashScreen.hide();
  // });
  return (
    <Provider store={store}>
      <SnackbarProvider>
        <div className="App">
          <Routers />
        </div>
      </SnackbarProvider>
    </Provider>
  );
};
