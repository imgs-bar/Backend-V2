import {Document, model, Model, Schema} from 'mongoose';

export interface User extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  key: string;
  embed: {
    enabled: boolean;
    header: string;
    author: string;
    title: string;
    description: string;
  };
  banned: {
    status: boolean;
    reason?: string | null;
  };
  roles: {
    premium: boolean;
    admin: boolean;
    mod: boolean;
  };
  settings: {
    longUrl: boolean;
    emojiUrl: boolean;
    showExtension: boolean;
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
    header: String,
    author: String,
    title: String,
    description: String,
  },
  blacklisted: {
    status: Boolean,
    reason: {
      type: String,
      required: false,
    },
  },
  roles: {
    premium: Boolean,
    admin: Boolean,
    mod: Boolean,
  },
  settings: {
    longUrl: Boolean,
    emojiUrl: Boolean,
    showExtension: Boolean,
  },
});

export const User: Model<User> = model('User', UserSchema);
