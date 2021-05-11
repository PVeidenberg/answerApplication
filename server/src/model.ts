import { io } from "./app";
import { Socket } from "./services/socketService";

interface User {
  id: string;
  name: string;
  socket: Socket;
}

interface Room {
  code: string;
  admin: Socket | null;
  users: User[];
  activeQuestion?: Question;
}

interface Answer {
  userName: string;
  answer: string;
  date: Date;
  isCorrect?: boolean;
}

interface Question {
  endDate: Date;
  answers: Answer[];
}

export const rooms: Record<string, Room> = {};

export function createRoom(code: string, socket: Socket): Room | null {
  if (!rooms[code]) {
    rooms[code] = {
      code,
      admin: socket,
      users: [],
    };

    return rooms[code];
  }

  if (!rooms[code].admin) {
    rooms[code].admin = socket;

    return rooms[code];
  }

  return null;
}

export function joinRoom(code: string, name: string, socket: Socket): void {
  if (!rooms[code]) {
    return;
  }

  const room = rooms[code];

  if (isUserInRoom(room, name)) {
    return;
  }

  room.users.push({
    id: socket.id,
    name,
    socket,
  });

  updateAdminAboutUsers(room);

  if (room.activeQuestion) {
    socket.emit("nextQuestion", { endDate: room.activeQuestion.endDate.toISOString() });
  }
}

function isUserInRoom(room: Room, userName: string) {
  return room.users.some(existingUser => existingUser.name === userName);
}

function getUserRoom(roomCode: string, userName: string) {
  const room = rooms[roomCode];

  if (!room) {
    return null;
  }

  return isUserInRoom(room, userName) ? room : null;
}

export function nextQuestion(roomCode: string, answerTime: number): void {
  const room = rooms[roomCode];

  if (!room) {
    return;
  }

  const endDate = new Date(Date.now() + answerTime * 1000);

  room.activeQuestion = {
    endDate,
    answers: [],
  };

  io.to(roomCode).emit("nextQuestion", { endDate: endDate.toISOString() });
}

export function checkIfRoomExists(roomCode: string): boolean {
  return !!rooms[roomCode];
}

export function saveAnswer(roomCode: string, userName: string, answerValue: string): void {
  const room = getUserRoom(roomCode, userName);

  const now = new Date();
  if (!room || !room.activeQuestion || room.activeQuestion.endDate < now) {
    return;
  }

  let answer = room.activeQuestion.answers.find(answerObj => answerObj.userName === userName);

  if (answer) {
    answer.answer = answerValue;
    answer.date = now;
  } else {
    answer = {
      userName,
      answer: answerValue,
      date: now,
    };
    room.activeQuestion.answers.push(answer);
  }

  if (room.admin) {
    room.admin.emit("answer", { ...answer, date: answer.date.toISOString() });
  }
}

export function toggleAnswerCorrectnessServer(roomCode: string, userName: string): void {
  const room = getUserRoom(roomCode, userName);

  if (!room || !room.activeQuestion) {
    return;
  }

  const answer = room.activeQuestion.answers.find(answerObj => answerObj.userName === userName);

  if (answer) {
    answer.isCorrect = !answer.isCorrect;

    const user = room.users.find(user => user.name === userName);

    if (user) {
      user.socket.emit("setAnswerCorrectness", { isCorrect: answer.isCorrect });
    }
  }
}

function getRoom(socket: Socket): [Room | null, boolean] {
  for (const room of Object.values(rooms)) {
    if (room.admin === socket) {
      return [room, true];
    }
    if (room.users.some(user => user.id === socket.id)) {
      return [room, false];
    }
  }

  return [null, false];
}

export function disconnect(socket: Socket): void {
  const [room, isAdmin] = getRoom(socket);

  if (room) {
    if (isAdmin) {
      room.admin = null;
    } else {
      room.users = room.users.filter(user => user.id !== socket.id);
      updateAdminAboutUsers(room);
    }

    if (!room.admin && room.users.length === 0) {
      delete rooms[room.code];
    }
  }
}

function updateAdminAboutUsers(room: Room) {
  if (room.admin) {
    console.log("update", !!room.admin, room.code);
    room.admin.emit(
      "users",
      room.users.map(user => ({ name: user.name })),
    );
  }
}
