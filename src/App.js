import React from "react";
import Routers from "./services/Routers";
import "./App.css";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store/index";
import { PersistGate } from "redux-persist/integration/react";
import SnackbarProvider from "react-simple-snackbar";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#269dd8" },
    secondary: { main: "#f6921e" },
    secondary80: { main: "#f6921e80" },
    white: { main: "#fff" },
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
