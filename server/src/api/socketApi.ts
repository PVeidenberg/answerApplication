import * as model from "../model";
import { Socket } from "../services/socketService";
import { Role } from "../../../shared/Types";

const generateRoomCode = () => {
  return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
};

export function socketHandler(socket: Socket): void {
  const session = socket.request.session;

  socket.on("createRoom", callback => {
    const roomCode = generateRoomCode();
    const room = model.createRoom(roomCode, socket);

    if (room) {
      session.roomCode = roomCode;
      session.role = Role.ADMIN;
      session.save();

      socket.join(roomCode);
      callback(null, {
        roomCode,
        // users: room.users.map(user => ({ name: user.name })),
        // answers: room.activeQuestion?.answers.map(answer => ({ ...answer, date: answer.date.toISOString() })),
      });
    } else {
      callback({ message: "Failed to create room" });
    }
  });

  socket.on("validateRoomCode", ({ roomCode }, callback) => {
    callback(model.checkIfRoomExists(roomCode));
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
