import mongoose from 'mongoose';
import config from 'config';

const uri = config.get("mongoDb.uri");
const connOptions = config.get("mongoDb.connOptions");
const conn = mongoose.createConnection(uri, connOptions);

const mongoModel = (collection = '', typeSchema) => {
  if (!collection || !typeSchema) throw new Error('collection or typeSchema doesn\'t specified!');
  const Model = conn.model(collection, typeSchema);
  return Model;
};

export default {
  Model: mongoModel,
  Schema: mongoose.Schema,
};
