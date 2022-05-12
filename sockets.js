import { Server as SocketIo } from 'socket.io';
import nickName from 'generate-username';
import _ from 'lodash';
import { chatModel } from './models/chat.js';

export default (server) => {
  const io = new SocketIo(server);

  return io.on('connection', (socket) => {
    // console.log(socket.handshake);
    socket.username = _.get(socket, 'handshake.auth.token', '');
    if (!socket.username) {
      const randName = `Anonym_${nickName.default()}`;
      socket.handshake.auth.token = randName;
      socket.username = randName;
      io.sockets.emit('username', randName);
      console.log(`We set new rand username: ${randName}!`);
    }

    socket.on('change_username', (data) => {
      console.log(
        'set new name before',
        data.username,
        socket.handshake.auth.token
      )
      socket.username = data.username;
      socket.handshake.auth.token = data.username;
    });
  
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

    socket.on('connect_error', (err) => {
      console.log(`connect_error due to ${err.message}`);
    });
  });
};