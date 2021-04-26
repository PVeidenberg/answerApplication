import { addAnswer, checkIfRoomExists, getAdmin } from "./users";

import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const { addUser, getUser, deleteUser, getUsers, getUsersWithoutAdmin } = require("./users");

const generateRoomCode = () => {
  var roomCode = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
  return roomCode;
};

io.on("connection", socket => {
  socket.on("askRoomCode", function (_: any, fn: any) {
    const roomCode = generateRoomCode();
    fn(roomCode);
  });

  socket.on("createRoom", ({ roomCode }: any, callback: any) => {
    addUser(socket.id, null, roomCode, true);
    socket.join(roomCode);
    const usersWithoutAdmin = getUsersWithoutAdmin(roomCode);
    callback(usersWithoutAdmin);
  });

  socket.on("validateRoomCode", ({ roomCode }: any, callback: any) => {
    if (checkIfRoomExists(roomCode)) {
      callback(true);
    } else {
      callback(false);
    }
  });

  socket.on("joinRoom", ({ userName, roomCode }: any) => {
    addUser(socket.id, userName, roomCode, false);
    const answer = getUser(socket.id).answer;
    socket.join(roomCode);
    io.to(getAdmin(roomCode)).emit("renderUser", { userName, answer });
  });

  socket.on("sendAnswer", ({ userName, answer, roomCode }: any) => {
    addAnswer(socket.id, answer);
    io.to(getAdmin(roomCode)).emit("renderUser", { userName, answer });
  });

  socket.on("nextQuestionServer", ({ roomCode, answerTime }: any) => {
    socket.broadcast.to(roomCode).emit("nextQuestion", { answerTime });
  });

  socket.on("endQuestionServer", ({ roomCode }: any) => {
    socket.broadcast.to(roomCode).emit("endQuestion");
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    deleteUser(socket.id);
    io.to(getAdmin(user.roomCode)).emit("deleteUser", { userName: user.userName });
  });
});

server.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
});
