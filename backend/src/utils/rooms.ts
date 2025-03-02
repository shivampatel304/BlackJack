import { WebSocket } from "ws"

interface User {
    userId: number;
    name: string;
    socket: WebSocket;
    cards?: any[];
}

interface Room {
    players: User[];
    deck: any[];
    dealer: { cards: any[]};
    status: "waiting" | "dealing" | "playing"
}

export const rooms: { [roomId: number]: Room } = {};