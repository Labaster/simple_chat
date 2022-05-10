import Koa from 'koa';
import cors from '@koa/cors';
import render from 'koa-ejs';
import serve from 'koa-static';
import mount from 'koa-mount';
import path from 'path';
import router from './routers/index.js';
import sockets from './sockets.js';

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

sockets(server);

process.on('uncaughtException', (err) => {
  console.error((new Date).toUTCString() + ' uncaughtException:', err.message);
  console.error(err.stack);
  process.exit(1);
});
