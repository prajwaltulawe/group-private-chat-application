const express = require('express');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 8080;

const server = express()
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

// DECLARING ARRAY OF users
const users = {};

io.on('connection', socket =>{

  // SERVER FUNCTION TO RESPONSE NEW USER
  socket.on('new-user-joined', user_name =>{
    users[socket.id] = user_name;
    socket.broadcast.emit('user-joined', {new_user_name: users[socket.id], new_user_id: socket.id});
    io.to(socket.id).emit('current_active_users_list', {active_user: users, my_id: socket.id});
  });

  // SERVER FUNCTION TO HANDLE MESSAGES
  socket.on('message-sended', message_sended =>{
    socket.broadcast.emit('message-received', {message: message_sended, sender_name: users[socket.id], sender_id: socket.id});
  });

  // SERVER FUNCTION TO HANDLE PRIVATE MESSAGES
  socket.on('pvt-message-sended', data =>{
    io.to(data.to).emit('pvt_message_received', {message_received: data.message, received_from: socket.id});
  });

  // SERVER FUNCTION ON DISCONNECTION OF USER
  socket.on('disconnect', message =>{
    socket.broadcast.emit('user-left', {left_user_name: users[socket.id], left_user_id: socket.id});
    delete users[socket.id];
  });

});
