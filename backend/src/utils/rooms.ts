import { WebSocket } from "ws"

export interface User {
    userId: number;
    name: string;
    socket: WebSocket;
    game?: Cards;
}

interface Room {
    players: User[];
    deck: any[];
    dealer: { cards: any[], points: number};
    status: "waiting" | "dealing" | "playing"
}

export interface Cards {
    cards: any[],
    points: number;
}

export const rooms: { [roomId: number]: Room } = {};