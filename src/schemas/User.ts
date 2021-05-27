import {Document, model, Model, Schema} from 'mongoose';

interface User extends Document {
  email: string;
  username: string;
  password: string;
  settings: {
    embed: boolean;
  };
}
const UserSchema: Schema = new Schema({
  email: {type: String, required: true},
  username: {type: String, required: true},
  password: {type: String, required: true},
  settings: {type: {embed: Boolean}, required: true},
});

const User: Model<User> = model('User', UserSchema);
