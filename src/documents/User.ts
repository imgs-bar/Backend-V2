import {Document, model, Model, Schema} from 'mongoose';

export interface User extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  key: string;
  embed: {
    enabled: boolean;
    siteName: string;
    author: string;
    title: string;
    description: string;
  };
}
const UserSchema: Schema = new Schema({
  _id: String,
  email: String,
  username: String,
  password: String,
  key: String,
  embed: {
    enabled: Boolean,
    siteName: String,
    author: String,
    title: String,
    description: String,
  },
});

export const User: Model<User> = model('User', UserSchema);
