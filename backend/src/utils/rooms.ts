import { WebSocket } from "ws"

interface RoomUsers{
    [roomId: number]: {userId: number, name: string, socket:WebSocket}[];
}

export const rooms: RoomUsers = {};