import { checkIfOnlyUserInTheRoom, getAdmin } from "./users";

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
  socket.on("createRoom",function(_ , fn) {
    const roomCode = generateRoomCode();
    addUser(socket.id, null, roomCode, true);
    socket.join(roomCode);
    fn(roomCode);  
  })

  socket.on("joinRoom", ({userName, roomCode}, callback) => {
    console.log("joinRoom", roomCode);
    const user = addUser(socket.id, userName, roomCode, false);
    if (user === {}) {
      io.to(socket.id).emit('notValidUserName');
    }

    if (checkIfOnlyUserInTheRoom(roomCode)) {
      console.log("checkIfOnlyUserInTheRoom");
      const user = getUser(socket.id);
      io.to(user.userID).emit('notValidRoomCode');
      deleteUser(socket.id);
      console.log("getUsers", getUsers());
      socket.leave(socket.id);
      console.log("leaveRoom", roomCode, userName);
    } else {
      console.log("joinRoom", roomCode, userName);
      const user = getUser(socket.id);
      io.to(user.userID).emit('validRoomCode', {userName, roomCode});
      socket.join(roomCode);
      console.log("getAdmin", getAdmin(roomCode));
      console.log("getUsers", getUsers());
      io.to(getAdmin(roomCode)).emit('renderUser', {userName, answer:""});
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
