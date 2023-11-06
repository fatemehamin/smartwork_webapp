import { getMessaging, onMessage } from "firebase/messaging";
import { fetchNewMsg } from "../features/msg/action";
import { fetchNewTasksLog } from "../features/tasks/action";
import { fetchNewLeaveRequests } from "../features/leaveRequests/action";

export const remoteNotification = (dispatch) => {
  const messaging = getMessaging();

  onMessage(messaging, (payload) => {
    const { type, id, last_duration_task, request } = payload.data;
    switch (type) {
      case "MSG":
        dispatch(fetchNewMsg({ id }));
        break;
      case "STOP_TASK":
        dispatch(fetchNewTasksLog({ id, last_duration_task }));
        break;
      case "LEAVE_REQUEST":
        dispatch(fetchNewLeaveRequests({ id, type }));
        break;
      case "REQUEST_ANSWER":
        dispatch(
          request === "leave"
            ? fetchNewLeaveRequests({ id, type })
            : fetchNewMsg({ id, type })
        );
        break;

      default:
        break;
    }
  });
};
