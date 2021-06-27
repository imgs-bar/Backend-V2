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
    status: {type: Boolean, default: false},
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
    longUrl: {type: Boolean, default: false},
    emojiUrl: {type: Boolean, default: true},
    showExtension: {type: Boolean, default: false},
    embeds: {
      type: [
        {
          header: String,
          author: String,
          title: String,
          description: String,
        },
      ],
      default: [
        {
          header: 'default',
          author: 'default',
          title: 'default',
          description: 'default',
        },
      ],
    },
  },
});

export const User: Model<User> = model('User', UserSchema);
