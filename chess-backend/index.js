require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Import the v4 version of uuid

const app = express();
app.use(cors());

const server = createServer(app);

// app.get('/api', (req, res) => {
//   res.send('<h1>Multiplayer Chess Backend</h1>');
// });

let roomStates = {}; // Object to store all active rooms and their states


function roomError(room, socket) {
  if (!roomStates || !roomStates[room]) {
    socket.emit("error", "Room does not exist");
    return true;
  }
  return false;
}

const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
  },
});

app.get('/',(req,res)=>{
  return res.send('<h1>hell world 12</h1>')
})

function getRoomID() {
  let min = 10000;
  let max = 99999;
  let roomId;
  do {
    roomId = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (roomStates[roomId]);
  return roomId;
}

// Check if username already exists in the room
function userNameError(roomId, userName) {
  // console.log('users is ------> ',roomStates[roomId].users);
  
  return roomStates[roomId].users.some((el)=>el.userName==userName);
}

io.on('connection', (socket) => {

  socket.on('create', (data) => {
    const roomId = getRoomID();
    const playerID = uuidv4();
    roomStates[roomId] = { users: [{playerID,userName:data.userName}], gameData: {},turn:data.userName,currentUserName:data.userName }; 
    socket.join(roomId);
    socket.emit('roomId', roomId); 
    socket.emit('playerID', playerID);

  });

  socket.on('join', (data) => {
    let { roomId, userName,gamesData } = data;
    roomId=Number(roomId);
    if (roomError(roomId, socket)) return;



    if (userNameError(roomId, userName)) {
      socket.emit('error', 'Username already taken');
      return;
    }


    const playerID = uuidv4();

    roomStates[roomId].users.push({userName,playerID});
    roomStates[roomId].gameData=gamesData;
    socket.join(roomId);

    socket.emit('playerID', playerID);
   
    let users=roomStates[roomId].users.map((el)=>el.userName);
    io.to(roomId).emit('startGame',{roomId,users,gamesData,turn:roomStates[roomId].turn,currentUserName:data.userName});

  });


  socket.on('joinWithCookie',(data)=>{
    let { roomId, playerID } = data;
    roomId=Number(roomId);
    if (roomError(roomId, socket)) return;

    
    // checkPlayer
    let result=roomStates[roomId].users.some((el)=>el.playerID==playerID);
    if(result){
      socket.join(roomId);
      let currentUserName=roomStates[roomId].users.filter(el=>el.playerID==playerID)[0].userName;
      let users=roomStates[roomId].users.map((el)=>el.userName);
        socket.emit('gamesData',{gamesData:roomStates[roomId].gameData,users,turn:roomStates[roomId].turn,currentUserName});
    }

  })


  socket.on('move', (data) => {
    let {roomId,gamesData,turn}=data;
    roomId=Number(roomId);
    io.to(roomId).emit('updateMoves',{gamesData,turn});


  })






  // Handle disconnection if needed
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    // Additional logic to handle disconnection and update room state
  });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
