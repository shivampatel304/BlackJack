import { rooms } from "../utils/rooms";
import { WebSocket } from "ws";

interface User {
  userId: number;
  name: string;
  socket: WebSocket;
}

export function handleJoinUser(socket: WebSocket, message: any) {
  const { userId, name, roomId } = message;

  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }

  const user: User = { userId, name, socket };
  rooms[roomId].push(user);

  console.log(`${name} joined room ${roomId}`);

  rooms[roomId].forEach((user) => {
    if (user.userId !== userId) {
      user.socket.send(
        JSON.stringify({
          type: "user-joined",
          name,
          roomId,
        })
      );
    }
  });
}

export function handleLeaveUser (socket: WebSocket, message: any){
    const { userId, name, roomId } = message;

      if (!rooms[roomId]) return;

      rooms[roomId] = rooms[roomId].filter((user) => user.userId !== userId);

      rooms[roomId].forEach((user) => {
        user.socket.send(
          JSON.stringify({
            type: "user-left",
            name,
            roomId,
          })
        );
      });

      console.log(`${name} has left the ${roomId}`);
    
}