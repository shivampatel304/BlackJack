import { WebSocketServer, WebSocket } from "ws";
import { handleClose, handleMessage } from "./routes/webSocketRoutes";

const PORT = 8080;
const server = new WebSocketServer({ port: PORT });

server.on("connection", (socket: WebSocket) => {
  console.log("Client connected");

  socket.on("message", (data) => handleMessage(socket, data));

  socket.on("close", () => handleClose(socket));
});

console.log(`WebSocket server is running on ws://localhost:${PORT}`);
