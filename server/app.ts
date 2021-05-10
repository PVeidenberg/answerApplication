import * as model from "./model";

import express from "express";
import http from "http";
import path from "path";
import { SocketIoServer } from "./SocketIoServer";

const app = express();

const DIST_FOLDER = path.join(__dirname, "../client/build");

const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
export const io = new SocketIoServer(server, {
  cors: { origin: "*" },
});

const generateRoomCode = () => {
  return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
};

io.on("connection", socket => {
  socket.on("askRoomCode", function (_args, cb) {
    const roomCode = generateRoomCode();
    cb(roomCode);
  });

  socket.on("createRoom", ({ roomCode }, callback) => {
    const room = model.createRoom(roomCode, socket);

    if (room) {
      socket.join(roomCode);
      callback({
        users: room.users.map(user => ({ name: user.name })),
        answers: room.activeQuestion?.answers.map(answer => ({ ...answer, date: answer.date.toISOString() })),
      });
    } else {
      callback({});
    }
    model.log();
  });

  socket.on("validateRoomCode", ({ roomCode }, callback) => {
    callback(model.checkIfRoomExists(roomCode));
  });

  socket.on("joinRoom", ({ userName, roomCode }) => {
    model.joinRoom(roomCode, userName, socket);
    socket.join(roomCode);
    model.log();
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

  socket.on("disconnect", reason => {
    model.disconnect(socket);
    model.log();
  });
});

app.use(express.static(DIST_FOLDER));

app.get("*", (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, "index.html"));
});

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
