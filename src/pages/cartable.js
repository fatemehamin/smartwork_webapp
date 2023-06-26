import React from "react";
import FloatingButton from "../components/floatingButton";
import Message from "../components/message";
import "./cartable.css";

const getMessage = () => {
  return [
    {
      msg: "سلام لطفا امروز بخش فروشگاهی سایت تکمیل گردد.",
      name: "fatemeh amin",
      time: new Date().getTime(),
      project: "SmartWork",
    },
    {
      msg: "سلام لطفا تسک مدساکو برای من تعریف کنید.",
      name: "فاطمه امین",
      time: new Date().getTime(),
      project: "باکس ایت ول",
    },
    {
      msg: "Hi, please say hi.",
      name: "fatemeh amin",
      time: new Date().getTime(),
      project: "BoxItWell",
    },
  ].map((msg, index) => (
    <Message
      key={index}
      msg={msg.msg}
      name={msg.name}
      time={new Date().getTime(msg.time)}
      project={msg.project}
    />
  ));
};

function Cartable() {
  return (
    <div className="cartable-container">
      {getMessage()} <FloatingButton type="request" />
    </div>
  );
}

export default Cartable;
