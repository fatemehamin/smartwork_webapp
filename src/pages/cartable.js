import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import FloatingButton from "../components/floatingButton";
import Message from "../components/message";
import MsgModal from "../components/msgModal";
import { fetchMsg } from "../features/msg/action";
import "./cartable.css";

const Cartable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { msg } = useSelector((state) => state.msg);
  const { type } = useSelector((state) => state.auth);
  const { users } = useSelector((state) => state.users);
  const { phoneNumber } = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMsg());
  }, []);

  const getMessage = () =>
    msg.map((msg) => {
      let name = users.find(
        (u) =>
          u.phone_number ===
          (type === "boss"
            ? msg.from === phoneNumber
              ? msg.to
              : msg.from
            : msg.from)
      );

      name = `${name.first_name} ${name.last_name} ${
        name.phone_number === phoneNumber
          ? "(ME)"
          : type !== "boss"
          ? "(MANAGER)"
          : ""
      }`;
      return (
        <Message
          key={msg.id}
          id={msg.id}
          msg={msg.msg}
          name={name}
          time={msg.time}
          project={msg.project}
          typeRequest={`${
            type === "boss"
              ? msg.from === phoneNumber
                ? "boss"
                : "user"
              : msg.from === phoneNumber
              ? "user"
              : "boss"
          }Request`}
          statusMsg={msg.status}
        />
      );
    });

  return (
    <div className="cartable-container">
      {getMessage()}
      <FloatingButton type="request" setModalVisibleProject={setModalVisible} />
      <MsgModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </div>
  );
};

export default Cartable;
