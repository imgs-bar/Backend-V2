import {Document, model, Model, Schema} from 'mongoose';

export interface User extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  settings: {
    embed: boolean;
  };
}
const UserSchema: Schema = new Schema({
  _id: {type: String, required: true},
  email: {type: String, required: true},
  username: {type: String, required: true},
  password: {type: String, required: true},
  settings: {type: {embed: Boolean}, required: true},
});

export const User: Model<User> = model('User', UserSchema);
