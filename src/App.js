import React from "react";
import Routers from "./services/Routers";
import SnackbarProvider from "react-simple-snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { store, persistor } from "./app/store";
import { Provider } from "react-redux";
import "./App.css";
import { PersistGate } from "redux-persist/integration/react";
import { injectStore } from "./services/API";
injectStore(store);

const theme = createTheme({
  palette: {
    primary: { main: "#269dd8" },
    primary50: { main: "#269dd850" },
    secondary: { main: "#f6921e" },
    secondary60: { main: "#f6921e60" },
    secondary80: { main: "#f6921e80" },
    white: { main: "#fff" },
    black: { main: "#000" },
  },
  typography: {
    allVariants: {
      fontFamily: "Vazirmatn, sans-serif",
    },
  },
});

const App = () => {
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

export default App;
