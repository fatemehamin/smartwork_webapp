import React, { useEffect, useState } from "react";
import Init from "../../pages/init";
import Login from "../../pages/login";
import Signup from "../../pages/signup";
import ForgotPassword from "../../pages/forgotPassword";
import VerifyCode from "../../pages/verifyCode";
import ChangePassword from "../../pages/changePassword";
import Manager from "../../pages/manager";
import MyTask from "../../pages/myTask";
import MyReport from "../../pages/myReport";
import Location from "../../pages/location";
import ShiftWork from "../../pages/shiftWork";
import ExportExcel from "../../pages/exportExcel";
import StatusMember from "../../pages/statusMember";
import PrivacyPolicy from "../../pages/privacyPolicy";
import getTokenDeviceFCM from "../../messaging_init_in_sw";
import { addFcmToken } from "../../features/notification/action";
import { remoteNotification } from "../../utils/notification";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const Routers = () => {
  const { isRTL } = useSelector((state) => state.i18n.I18nManager);
  const { isAuthentication, refreshToken } = useSelector((state) => state.auth);
  const { id } = useSelector((state) => state.notification);

  const [fcmToken, setFcmToken] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    remoteNotification(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthentication && id === null) {
      fcmToken === null
        ? getTokenDeviceFCM(setFcmToken)
        : dispatch(addFcmToken({ fcm_token: fcmToken, model: "web" }));
    }
  }, [dispatch, fcmToken, id, isAuthentication]);

  document.documentElement.style.setProperty("--dir", isRTL ? "rtl" : "ltr"); // fix direction for change i18n
  document.documentElement.style.setProperty(
    "--align",
    isRTL ? "right" : "left"
  );

  const authElement = (Component) => {
    return refreshToken ? <Navigate to="/" /> : <Component />;
  };

  const mainElement = (Component) => {
    return refreshToken ? <Component /> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Init />} />
        <Route path="/login" element={authElement(Login)} />
        <Route path="/signup" element={authElement(Signup)} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/forgotPassword" element={authElement(ForgotPassword)} />
        <Route path="/changePassword" element={authElement(ChangePassword)} />
        <Route
          path="/verifyCode/:phoneNumber/:type"
          element={authElement(VerifyCode)}
        />
        <Route path="/manager" element={mainElement(Manager)} />
        <Route path="/myTasks" element={mainElement(MyTask)} />
        <Route path="/myReport" element={mainElement(MyReport)} />
        <Route path="/location" element={mainElement(Location)} />
        <Route path="/shiftWork" element={mainElement(ShiftWork)} />
        <Route path="/exportExcel" element={mainElement(ExportExcel)} />
        <Route
          path="/statusMember/:currentId"
          element={mainElement(StatusMember)}
        />
      </Routes>
    </Router>
  );
};

export default Routers;
