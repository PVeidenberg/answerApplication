import { Socket } from "./socketService";

interface User {
  id: string;
  name: string;
  socket: Socket;
}

interface Room {
  code: string;
  adminId: string;
  adminSocket?: Socket;
  users: User[];
}

function generateRoomCode() {
  let i = 10;

  while (i-- > 0) {
    const code = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);

    if (!rooms[code]) {
      return code;
    }
  }

  return null;
}

const rooms: Record<string, Room> = {};

export const roomService = {
  getRoomByCode(roomCode: string): Room {
    const room = rooms[roomCode];

    if (!room) {
      throw new Error(`Room "${roomCode}" not found`);
    }

    return room;
  },
  createRoom(adminId: string): Room | null {
    const code = generateRoomCode();

    if (!code) {
      return null;
    }

    const room: Room = {
      code,
      adminId,
      users: [],
    };

    rooms[code] = room;

    return room;
  },
  joinRoomAsAdmin(roomCode: string, userId: string, socket: Socket): Room {
    const room = this.getRoomByCode(roomCode);

    if (room.adminId !== userId) {
      throw new Error("Not authorized");
    }

    room.adminSocket = socket;

    return room;
  },
  canJoinRoom(roomCode: string, name: string): { roomCode: string | null; name: string | null } | null {
    let room;

    try {
      room = this.getRoomByCode(roomCode);
    } catch (e) {
      return {
        roomCode: e.message,
        name: null,
      };
    }

    if (room.users.some(user => user.name === name)) {
      return { roomCode: null, name: "Name already in use" };
    }

    return null;
  },
};
