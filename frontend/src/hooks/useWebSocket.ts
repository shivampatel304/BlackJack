import {useState, useEffect, useRef} from "react";

interface WebSocketMessage {
    type: string;
    [key: string]: any;
}

export function useWebSocket(){
    const [messages, setMessages] = useState<WebSocketMessage[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [roomId, setRoomId] = useState<number | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const connectToWebSocket = (roomId: number, userId: number, name: string) => {
        if(socketRef.current){
            socketRef.current.close();
        }

        const socket = new WebSocket("ws://localhost:8080");
        socketRef.current = socket;

        socket.onopen = () => {
            console.log("Connected to WebSocket server");
            setIsConnected(true);

            // send a join message
            socket.send(JSON.stringify({type: "join", roomId, userId, name}));
            setRoomId(roomId);
        }

        socket.onmessage = (event) => {
            const data: WebSocketMessage = JSON.parse(event.data);
            console.log("Received message : ", data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };

        socket.onclose = () => {
            console.log("WebSocket closed");
            setIsConnected(false);
            setRoomId(null);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error : ", error);
        };
    };

    const sendMessage = (message: WebSocketMessage) => {
        if(socketRef.current && socketRef.current.readyState === WebSocket.OPEN){
            socketRef.current.send(JSON.stringify(message));
        }else {
            console.error("WebSocket is not open");
        }
    }

    const leaveRoom = (userId: number, name: string) => {
        if(socketRef.current && roomId !== null){
            socketRef.current.send(JSON.stringify({
                type: "leave", userId, roomId, name
            }));
            socketRef.current.close();
        }
    }

    return { messages, isConnected, roomId, connectToWebSocket, sendMessage, leaveRoom};
}