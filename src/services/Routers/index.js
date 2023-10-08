import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
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
import ExportExcel from "../../pages/exportExcel";
import StatusMember from "../../pages/statusMember";
import PrivacyPolicy from "../../pages/privacyPolicy";

const Routers = () => {
  // fix direction for change i18n
  const { isRTL } = useSelector((state) => state.i18n.I18nManager);
  document.documentElement.style.setProperty("--dir", isRTL ? "rtl" : "ltr");
  document.documentElement.style.setProperty(
    "--align",
    isRTL ? "right" : "left"
  );
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Init />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/verifyCode/:phoneNumber/:type" element={<VerifyCode />} />
        <Route path="/changePassword" element={<ChangePassword />} />
        <Route path="/manager" element={<Manager />} />
        <Route path="/myTasks" element={<MyTask />} />
        <Route path="/myReport" element={<MyReport />} />
        <Route path="/location" element={<Location />} />
        <Route path="/exportExcel" element={<ExportExcel />} />
        <Route path="/statusMember/:currentId" element={<StatusMember />} />
      </Routes>
    </Router>
  );
};

export default Routers;
