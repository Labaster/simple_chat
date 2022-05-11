import Router from 'koa-router';
import config from 'config';
import { getChatHistoryAction } from '../controllers/index.js';

const router = new Router();

router.get('/', async (ctx) => {
  await ctx.render('index', { webSocketConn: config.get('webSocketConn') });
});
router.get('/getChatHistory', getChatHistoryAction);

export default router;
