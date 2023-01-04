import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Init from "../../pages/init";
import Login from "../../pages/login";
import Signup from "../../pages/signup";
import ForgotPassword from "../../pages/forgotPassword";
import VerifyCode from "../../pages/verifyCode";
import ChangePassword from "../../pages/changePassword";
import Manager from "../../pages/manager";
import MyTask from "../../pages/myTask";
import MyReport from "../../pages/myReport";
import ListOfProjects from "../../pages/listOfProjects";
import Location from "../../pages/location";
import VIP from "../../pages/VIP";
import ExportExcel from "../../pages/exportExcel";
import StatusMember from "../../pages/statusMember";

export default () => (
  <Router>
    <Routes>
      <Route path="/" element={<Init />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgotPassword" element={<ForgotPassword />} />
      <Route path="/verifyCode/:phoneNumber/:type" element={<VerifyCode />} />
      <Route path="/changePassword" element={<ChangePassword />} />
      <Route path="/manager" element={<Manager />} />
      <Route path="/myTasks" element={<MyTask />} />
      <Route path="/myReport" element={<MyReport />} />
      <Route path="/listOfProjects" element={<ListOfProjects />} />
      <Route path="/location" element={<Location />} />
      <Route path="/VIP" element={<VIP />} />
      <Route path="/exportExcel" element={<ExportExcel />} />
      <Route path="/statusMember" element={<StatusMember />} />
    </Routes>
  </Router>
);
