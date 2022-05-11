import { chatModel } from '../models/chat.js';

export const getChatHistoryAction = async (ctx) => {
  try {
    const chatHistoryData = await chatModel.getMsgs();
    console.log(chatHistoryData);
  } catch (e) {
    console.log('getChatHistoryAction err -->', e);
  }
};