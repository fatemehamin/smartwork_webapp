import React, { useState } from "react";
import AppBar from "../components/appBar";
import Tabs from "../components/tabs";
import Users from "../pages/users";
import Cartable from "../pages/cartable";

const Manager = () => {
  const [activeFilter, setActiveFilter] = useState("users");

  return (
    <>
      <AppBar label="Smart Work" />
      <Tabs
        titles={["users", "cartable"]}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />
      {activeFilter === "users" ? <Users /> : <Cartable />}
    </>
  );
};

export default Manager;
