import {Document, model, Model, Schema} from 'mongoose';

export interface User extends Document {
  //The user's UUID
  _id: string;

  //The users UID
  uid: number;

  //The user's email
  email: string;

  //The user's username (changeable)
  username: string;

  //The users password (hashed in argon2)
  password: string;

  //The amount of ungenerated invites the user has left.
  invites: number;

  //The user's upload key
  key: string;

  //The user's banned status.
  banned: {
    //If they're banned
    status: boolean;

    //The reason they are banned
    reason?: string | null;
  };

  //The user's roles
  roles: {
    premium: {
      //If the user currently has premium.
      status: boolean;

      //The unix timestamp when premium expires. -1 if it doesnt
      endsAt: number;
    };
    //If the user should have unlimited invites, and access to the admin dashboard.
    admin: boolean;

    //If the user should have access to the mod dashboard
    mod: boolean;
  };

  // The user's settings
  settings: {
    //If the user's upload URLS should be longer.
    longUrl: boolean;

    //If the user's upload URLS should consist of emojis
    emojiUrl: boolean;

    //If the user's upload URLS should show the file extension
    showExtension: boolean;

    //The user's embed settings
    embeds: {
      //If the user has discord embeds enabled
      enabled: boolean;

      //The list of embed "profiles"
      list: {
        //The name of the embed profile
        name: string;

        //The embed "site url" also known as provider
        header: string;

        //The embed author.
        author: string;

        //The embed title
        title: string;

        //The embed description
        description: string;
      }[];
    };
  };
}

const UserSchema: Schema = new Schema({
  _id: String,
  uid: Number,
  email: String,
  username: String,
  password: String,
  invites: {type: Number, default: 0},
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
      enabled: {type: Boolean, default: true},
      list: {
        type: [
          {
            name: String,
            header: String,
            author: String,
            title: String,
            description: String,
          },
        ],
        default: [
          {
            name: 'Default profile',
            header: 'default',
            author: 'default',
            title: 'default',
            description: 'default',
          },
        ],
      },
    },
  },
});

export const User: Model<User> = model('User', UserSchema);
