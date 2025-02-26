import React, {useState} from "react";
import { useWebSocket } from "../hooks/useWebSocket";

const Table: React.FC = () => {
   const {messages, isConnected, roomId, connectToWebSocket, sendMessage, leaveRoom} = useWebSocket();
   const [message, setMessage] = useState("");
   const [roomInput, setRoomInput] = useState("");
   const [name, setName] = useState("");
   const userId = Math.floor(Math.random() * 1000);

   const handleJoinRoom = () => {
    const roomIdNumber = Number(roomInput);
    if(!roomIdNumber || !name.trim()){
        alert("Enter a valid Room ID and Name!");
        return;
    }
    connectToWebSocket(roomIdNumber, userId, name);
   };

   const handleSendMessage = () => {
    if(message.trim() && roomId !== null){
        sendMessage({type: "message", content: message, roomId, userId, name});
        setMessage("");
    }
   }
   return (
    <div>
      <h2>WebSocket Chat</h2>
      <p>Status: {isConnected ? `Connected to Room ${roomId} ✅` : "Disconnected ❌"}</p>

      {!isConnected && (
        <div>
          <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="number" placeholder="Enter Room ID" value={roomInput} onChange={(e) => setRoomInput(e.target.value)} />
          <button onClick={handleJoinRoom}>Join Room</button>
        </div>
      )}

      {isConnected && (
        <div>
          <div style={{ border: "1px solid black", padding: "10px", height: "200px", overflowY: "auto" }}>
            {messages.map((msg, index) => (
              <p key={index}>
                <strong>{msg.name}:</strong> {msg.content}
              </p>
            ))}
          </div>

          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
          <button onClick={handleSendMessage}>Send</button>
          <button onClick={() => leaveRoom(userId, name)}>Leave Room</button>
        </div>
      )}
    </div>
   );
}

export default Table;