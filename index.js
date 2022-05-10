import Koa from 'koa';
import cors from '@koa/cors';
import render from 'koa-ejs';
import serve from 'koa-static';
import mount from 'koa-mount';
import { Server as SocketIo } from 'socket.io';
import path from 'path';
import router from './routers/index.js';

const app = new Koa();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app
  .use(cors())
  .use(router.allowedMethods())
  .use(router.routes())
  .use(mount('/', serve(__dirname + '/public')));

render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'index',
  viewExt: 'ejs',
});

const server = app.listen(PORT, () => console.log(`Server started at port http://localhost:${PORT}`));

const io = new SocketIo(server);

io.on('connection', (socket) => {
  console.log('New user connected!')

  socket.username = "Anonymous"
  socket.on('change_username', (data) => socket.username = data.username);

  socket.on('new_message', (data) => {
    io.sockets.emit('add_mess', { message: data.message, username: socket.username, className: data.className });
  })

  socket.on('typing', (data) => {
    console.log(data);
    socket.broadcast.emit('typing', { username: socket.username })
  })
});

process.on('uncaughtException', (err) => {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});
