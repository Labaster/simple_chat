import { Server as SocketIo } from 'socket.io';

export default (server) => {
  const io = new SocketIo(server);

  return io.on('connection', (socket) => {
    console.log('New user connected!')
  
    socket.username = 'Anonymous';
    socket.on('change_username', (data) => socket.username = data.username);
  
    socket.on('new_message', (data) => {
      io.sockets.emit('add_mess', { message: data.message, username: socket.username, className: data.className });
    })
  
    socket.on('typing', () => socket.broadcast.emit('typing', { username: socket.username }));
  });
};