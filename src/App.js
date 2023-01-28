import React, { useEffect } from "react";
import Routers from "./services/Routers";
import "./App.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/index";
import { PersistGate } from "redux-persist/integration/react";
import SnackbarProvider from "react-simple-snackbar";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
// import SplashScreen from 'react-native-splash-screen';
const theme = createTheme({
  palette: {
    primary: { main: "#269dd8" },
    secondary: { main: "#f6921e" },
    secondary80: { main: "#f6921e80" },
    white: { main: "#fff" },
  },
});
export default () => {
  // //Hide Splash screen on app load.
  // useEffect(() => {
  //   SplashScreen.hide();
  // });
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SnackbarProvider>
          <div className="App">
            <ThemeProvider theme={theme}>
              <Routers />
            </ThemeProvider>
          </div>
        </SnackbarProvider>
      </PersistGate>
    </Provider>
  );
};
