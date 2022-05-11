import { Server as SocketIo } from 'socket.io';
import nickName from 'generate-username';
import { chatModel } from './models/chat.js';

export default (server) => {
  const io = new SocketIo(server);

  return io.on('connection', (socket) => {
    console.log('New user connected!')
  
    socket.username = `Anonym_${nickName.default()}`;
  
    socket.on('change_username', (data) => socket.username = data.username);
  
    socket.on('new_message', (data) => {
      const dataObj = {
        username: socket.username,
        message: data.message,
        className: data.className,
        createdAt: new Date(),
      };

      chatModel.saveMsg(dataObj)
        .catch(err => console.log('chatModel.saveMsg -->', err));
      
      io.sockets.emit('add_mess', dataObj);
    });
  
    socket.on('typing', () => socket.broadcast.emit('typing', { username: socket.username }));

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  });
};