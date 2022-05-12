import mongodConf from '../services/mongoDbConn.js';

const collection = 'chat_msgs'

/**
 * @description Chat collection scheme
 */
const chatSchema = new mongodConf.Schema({
  id: {type: Number, default: undefined, index: true},
  username: { type: String, default: '' },
  message: { type: String, default: '' },
  className: { type: String, default: 'danger' },
  createdAt: { type: Date, default: new Date() },
});

const Chat = mongodConf.Model(collection, chatSchema);

/**
 * @description Save msg
 * @param {String} [username]
 * @param {String} [message]
 */
chatSchema.statics.saveMsg = (params = {}) => {
  if (!params.username || !params.message) return new Promise((reject) => reject('Username or message is empty!'));
  return new Promise((resolve, reject) => {
    Chat.create(params, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  })
};

/**
 * @description Get all msgs ordering by date ASC
 */
chatSchema.statics.getMsgs = async() => Chat.find().sort({ createdAt: 1 });

export const chatModel = chatSchema.statics;
