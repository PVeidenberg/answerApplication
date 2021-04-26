import { addAnswer, checkIfRoomExists, getAdmin } from "./users";
import * as model from "./model";

import express from "express";
import http from "http";
import { Server } from "socket.io";
import * as util from "util";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
export const io = new Server(server, {
  cors: { origin: "*" },
});
const { addUser, getUser, deleteUser, getUsers, getUsersWithoutAdmin } = require("./users");

const generateRoomCode = () => {
  return (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
};

io.on("connection", socket => {
  socket.on("askRoomCode", function (_: any, fn: any) {
    const roomCode = generateRoomCode();
    fn(roomCode);
  });

  socket.on("createRoom", ({ roomCode }: any, callback: any) => {
    const room = model.createRoom(roomCode, socket);

    if (room) {
      socket.join(roomCode);
      callback(
        room.users.map(user => ({ name: user.name })),
        room.activeQuestion?.answers,
      );
    } else {
      callback(null);
    }
    model.log();
  });

  socket.on("validateRoomCode", ({ roomCode }: any, callback: any) => {
    callback(model.checkIfRoomExists(roomCode));
  });

  socket.on("joinRoom", ({ userName, roomCode }: any) => {
    model.joinRoom(roomCode, userName, socket);
    socket.join(roomCode);
    model.log();
  });

  socket.on("sendAnswer", ({ userName, answer, roomCode }: any) => {
    model.saveAnswer(roomCode, userName, answer);
    console.log(model.rooms);
  });

  socket.on("toggleAnswerCorrectnessServer", ({ userName, roomCode }: any) => {
    model.toggleAnswerCorrectnessServer(roomCode, userName);
    console.log(model.rooms);
  });

  socket.on("nextQuestionServer", ({ roomCode, answerTime }: any) => {
    model.nextQuestion(roomCode, answerTime);
    console.log(model.rooms);
  });

  socket.on("endQuestionServer", ({ roomCode }: any) => {
    socket.broadcast.to(roomCode).emit("endQuestion");
  });

  socket.on("disconnect", () => {
    model.disconnect(socket);
    model.log();
  });
});

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
