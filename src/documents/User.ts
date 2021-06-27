import {Document, model, Model, Schema} from 'mongoose';

export interface User extends Document {
  _id: string;
  email: string;
  username: string;
  password: string;
  key: string;
  banned: {
    status: boolean;
    reason?: string | null;
  };
  roles: {
    premium: {
      status: boolean;
      endsAt: number;
    };
    admin: boolean;
    mod: boolean;
  };
  settings: {
    longUrl: boolean;
    emojiUrl: boolean;
    showExtension: boolean;
    embeds: {
      enabled: boolean;
      header: string;
      author: string;
      title: string;
      description: string;
    }[];
  };
}

const UserSchema: Schema = new Schema({
  _id: String,
  email: String,
  username: String,
  password: String,
  key: String,
  banned: {
    status: Boolean,
    reason: {
      type: String,
      required: false,
    },
  },
  roles: {
    premium: {
      status: {type: Boolean, default: false},
      endsAt: {type: Number, default: -1},
    },
    admin: {
      type: Boolean,
      default: false,
    },
    mod: {
      type: Boolean,
      default: false,
    },
  },
  settings: {
    longUrl: Boolean,
    emojiUrl: Boolean,
    showExtension: Boolean,
    embeds: [
      {
        enabled: Boolean,
        header: String,
        author: String,
        title: String,
        description: String,
      },
    ],
  },
});

export const User: Model<User> = model('User', UserSchema);
