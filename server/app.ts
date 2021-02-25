import { checkIfRoomExists, getAdmin } from "./users";

const app = require('express')();
const http = require('http').createServer(app);
const PORT = process.env.PORT || 5000;
const io = require('socket.io')(http, {cors: {
  origin: '*',
  } 
});
const cors = require('cors');
const {addUser, getUser, deleteUser, getUsers, addAdmin} = require('./users');

const generateRoomCode = () => {
    var roomCode = (Math.floor(Math.random() * 10000) + 10000).toString().substring(1);
    return roomCode;
}

app.use(cors())
io.on('connection', (socket) => {
  socket.on("connect",function(roomCode , fn) {
    socket.join(roomCode);
  })

  socket.on("createRoom",function(_ , fn) {
    const roomCode = generateRoomCode();
    addUser(socket.id, null, roomCode, true);
    socket.join(roomCode);
    fn(roomCode);  
  })

  socket.on("joinRoom", ({userName, roomCode}, callback) => {
    if (checkIfRoomExists(roomCode)) {
      console.log("roomExists");
      addUser(socket.id, null, roomCode, true);
      console.log("joining room - ", roomCode, "username - ", userName);
      console.log("getAdmin", getAdmin(roomCode));
      console.log("getUsers", getUsers());
      socket.join(roomCode);
      io.to(socket.id).emit('validRoomCode', {userName, roomCode});
      io.to(getAdmin(roomCode)).emit('renderUser', {userName, answer:""});
    } else {
      io.to(socket.id).emit('notValidRoomCode');
      socket.leave(socket.id);
      console.log("getUsers", getUsers());
      console.log("leaveRoom", roomCode, userName);
    }
  })

  socket.on("sendAnswer", ({userName, answer, roomCode }) => {
    io.to(getAdmin(roomCode)).emit('renderUser', {userName, answer});
  })

  socket.on("nextQuestionServer", ({roomCode, answerTime, questionNumber}) => {
    socket.broadcast.to(roomCode).emit('nextQuestion', {answerTime, questionNumber});
  })

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    deleteUser(socket.id);
    io.to(getAdmin(user.roomCode)).emit('deleteUser', {userName: user.userName});
    console.log("disconnect");
  })
})

http.listen(PORT, () => {
  console.log(`Listening to ${PORT}`);
})
