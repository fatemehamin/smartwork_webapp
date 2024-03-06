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
import ProfileSetting from "../../pages/profileSetting";
import EditProfile from "../../pages/editProfile";
import NotFound from "../../pages/notFound";
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
  const { id } = useSelector((state) => state.notification);
  const { isAuthentication, refreshToken, type } = useSelector(
    (state) => state.auth
  );

  const [fcmToken, setFcmToken] = useState(null);

  const dispatch = useDispatch();

  const admin = type === "boss";
  const financial = admin || type === "financial";

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

  const mainElement = (Component, permission = true) => {
    return refreshToken ? (
      permission ? (
        <Component />
      ) : (
        <NotFound />
      )
    ) : (
      <Navigate to="/login" />
    );
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
        <Route path="/manager" element={mainElement(Manager, admin)} />
        <Route path="/myTasks" element={mainElement(MyTask)} />
        <Route path="/myReport" element={mainElement(MyReport)} />
        <Route path="/location" element={mainElement(Location, admin)} />
        <Route path="/shiftWork" element={mainElement(ShiftWork, admin)} />
        <Route
          path="/exportExcel"
          element={mainElement(ExportExcel, financial)}
        />
        <Route
          path="/statusMember/:currentId"
          element={mainElement(ProfileSetting, admin)}
        />
        <Route
          path="/statusMember/:currentId/editProfile"
          element={mainElement(EditProfile, admin)}
        />
      </Routes>
    </Router>
  );
};

export default Routers;
