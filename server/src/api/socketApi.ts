import { Role } from "../../../shared/Types";
import * as model from "../model";
import { roomService } from "../services/roomService";
import { Socket } from "../services/socketService";

export function socketHandler(socket: Socket): void {
  const session = socket.request.session;

  const user = session.user;

  if (!user) {
    socket.disconnect();

    return;
  }

  socket.on("createRoom", callback => {
    const room = roomService.createRoom(user.id);

    if (room) {
      session.roomCode = room.code;
      session.role = Role.ADMIN;
      session.save();

      callback(null, {
        roomCode: room.code,
      });
    } else {
      callback({ message: "Failed to create room" });
    }
  });

  socket.on("joinRoomAsAdmin", ({ roomCode }, cb) => {
    try {
      const room = roomService.joinRoomAsAdmin(roomCode, user.id, socket);

      cb(null, { users: room.users });
    } catch (err) {
      cb({ message: err.message });

      return;
    }
  });

  socket.on("canJoinRoom", ({ roomCode, name }, callback) => {
    callback(roomService.canJoinRoom(roomCode, name));
  });

  socket.on("joinRoom", ({ userName, roomCode }) => {
    model.joinRoom(roomCode, userName, socket);
    socket.join(roomCode);
  });

  socket.on("sendAnswer", ({ userName, answer, roomCode }) => {
    model.saveAnswer(roomCode, userName, answer);
    console.log(model.rooms);
  });

  socket.on("toggleAnswerCorrectnessServer", ({ userName, roomCode }) => {
    model.toggleAnswerCorrectnessServer(roomCode, userName);
    console.log(model.rooms);
  });

  socket.on("nextQuestionServer", ({ roomCode, answerTime }) => {
    model.nextQuestion(roomCode, answerTime);
    console.log(model.rooms);
  });

  socket.on("endQuestionServer", ({ roomCode }) => {
    socket.broadcast.to(roomCode).emit("endQuestion");
  });

  socket.on("disconnect", () => {
    model.disconnect(socket);
  });
}
