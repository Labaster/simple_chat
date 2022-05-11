import { chatModel } from '../models/chat.js';

export const getChatHistoryAction = async (ctx) => {
  let data = [];
  try {
    data = await chatModel.getMsgs();
  } catch (e) {
    console.log('getChatHistoryAction err -->', e);
  }
  ctx.body = data;
};