require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Import the v4 version of uuid

console.log('frontend url is ----> ',process.env.FRONTEND_URL);

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL,
}
));

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


const io = socketIO(server, );

app.get('/',(req,res)=>{
  return res.send('<h1>hell world 12</h1>')
})

app.get('/newHome',(req,res)=>{
  return res.send('<h1>new home login bro</h1>')
})

app.get('/newRequest',(req,res)=>{
 return res.status(200).json({message:'event come from backend'});
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


function checkUserCountError(roomId){
  if(roomStates[roomId]?.users?.length==2){
    return true;
  }
  return false;

}
io.on('connection', (socket) => {
  socket.on('create', (data) => {
    const roomId = getRoomID();
    const playerID = uuidv4();
    roomStates[roomId] = { users: [{playerID,userName:data.userName}], gamesData: {},turn:data.userName }; 
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


    if(checkUserCountError(roomId)){
      socket.emit("error", "Sorry Room already filled");
      return;
    }
   

    const playerID = uuidv4();

    roomStates[roomId].users.push({userName,playerID});
    roomStates[roomId].gamesData=gamesData;
    socket.join(roomId);
    socket.emit('playerID', playerID);
    io.to(roomId).emit('startGame',{...roomStates[roomId],roomId});

  });


  socket.on('joinWithCookie',(data)=>{
    let { roomId, playerID } = data;
    roomId=Number(roomId);
    if (roomError(roomId, socket)) return;
    
    // checkPlayer
    let result=roomStates[roomId].users.some((el)=>el.playerID==playerID);
    if(result){
      socket.join(roomId);
        socket.emit('gamesData',{...roomStates[roomId]});
    }
    else{
    socket.emit('error','You dont have access to this room')
    }
  })


  socket.on('move', (data) => {
    let {roomId,gamesData,turn}=data;
    roomId=Number(roomId);
    roomStates[roomId].gamesData=gamesData;
   
    if(turn){
      roomStates[roomId].turn=turn;
    }
      io.to(roomId).emit('updateMoves',{...roomStates[roomId]});
  })


  socket.on('leaveRoom', (data) => {
    let {roomId}=data;
    roomId=Number(roomId);
    if(roomStates[roomId]){
      delete roomStates[roomId];
      io.to(roomId).emit('gameLeave');
    }
  });



  // Handle disconnection if needed
  socket.on('disconnect', () => {
  });
});


const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
