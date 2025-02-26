import { WebSocket } from "ws";
import { handleJoinUser, handleLeaveUser } from "../controllers/roomController";

export function handleMessage(socket: WebSocket, data: any) {
  try {
    const message = JSON.parse(data.toString());

    if (message.type === "join") {
      handleJoinUser(socket, message);
    } else if (message.type === "leave") {
      handleLeaveUser(socket, message);
    }
  } catch (error) {
    console.error("Invalid message format:", error);
  }
}

export function handleClose(socket: WebSocket) {
  console.log("Client disconnected");
}
