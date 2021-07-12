import {Document, model, Model, Schema} from 'mongoose';

export interface User extends Document {
  /**
   * The users UUID
   */
  _id: string;

  /**
   * The users UID
   */
  uid: number;

  /**
   * The users original uid
   */
  originalUid: number;

  /**
   * The users email address
   */
  email: string;

  /**
   * The users username
   */
  username: string;

  /**
   * The users password (hashed)
   */
  password: string;

  /**
   * The amount of ungenerated invites the user has left.
   */
  invites: number;

  /**
   * The users upload key
   */
  key: string;

  /**
   * The users amount of uploads
   */
  uploads: number;

  /**
   * The users amount of invited people
   */
  invited: number;

  /**
   * The users banned status
   */
  banned: {
    /**
     * If they're banned
     */
    status: boolean;

    /**
     * The users reason for being banned
     */
    reason?: string | null;
  };

  /**
   * The users cooldowns
   */
  cooldowns: {
    /**
     * The users last uid change
     */
    lastUidChange: Date;
  };

  /**
   * The users roles
   */
  roles: {
    premium: {
      /**
       * Current premium status
       */
      status: boolean;

      /**
       * When should premium expire
       */
      endsAt: number;
    };
    /**
     * If the user has admin access
     */
    admin: boolean;

    /**
     * If the user has moderator access
     */
    mod: boolean;
  };

  /**
   * The users discord stuff
   */
  discord: {
    /**
     * If the discord is currently linked
     */
    linked: boolean;

    /**
     * The users discord id
     */
    id?: string;

    /**
     * The users discord discriminator / tag
     */
    discriminator?: string;

    /**
     * The users refresh token
     */
    refreshToken?: string;
    /**
     * The users discord avatar url
     */
    avatar?: string;
  };

  /**
   * The users badges
   */
  badges: {
    verified: boolean;
    earlySupporter: boolean;
  };

  /**
   * If the users profile is private
   */
  private: boolean;

  /**
   * The users settings
   */
  settings: {
    //Length of users uploads
    urlLength: number;

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
        //The embed's ID
        _id: string;

        //The name of the embed profile
        name: string;

        //The embed "site url" also known as provider
        header: {
          text: string;
          url: string;
        };

        //The embed author.
        author: {
          text: string;
          url: string;
        };

        //The embed title
        title: string;

        //The embed description
        description: string;

        //Embed color, set it to "random" for random
        color: string;
      }[];
    };

    //The user's domains
    domains: {
      //The domain's domain, i.e imgs.bar
      name: string;

      //The domains subdomain, i.e beta. Not in use with fake url
      subDomain: string;

      //The embed author.
      fake: boolean;

      //The domain's embed's _id.
      embeds: string[];

      //What should be added to the filename, also supports directories
      fileNamePrefix: string;
    }[];
  };
}

const UserSchema: Schema = new Schema({
  _id: String,
  uid: Number,
  originalUid: Number,
  email: String,
  username: String,
  password: String,
  invites: {type: Number, default: 0},
  key: String,
  uploads: {type: Number, default: 0},
  invited: {type: Number, default: 0},
  discord: {
    linked: {type: Boolean, default: false},
    id: {type: String, default: null},
    discriminator: {type: String, default: null},
    refreshToken: {type: String, default: null},
    avatar: {type: String, default: null},
  },
  banned: {
    status: {type: Boolean, default: false},
    reason: {
      type: String,
      required: false,
    },
  },
  cooldowns: {
    lastUidChange: {type: Date, default: null},
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
  badges: {
    verified: {type: Boolean, default: false},
    earlySupporter: {type: Boolean, default: false},
  },
  private: {type: Boolean, default: false},
  settings: {
    urlLength: {type: Number, default: 10},
    emojiUrl: {type: Boolean, default: true},
    showExtension: {type: Boolean, default: false},
    embeds: {
      enabled: {type: Boolean, default: true},
      list: {
        type: [
          {
            _id: String,
            name: String,
            header: {
              text: String,
              url: String,
            },
            author: {
              text: String,
              url: String,
            },
            title: String,
            description: String,
            color: String,
          },
        ],
        default: [
          {
            _id: 'default',
            name: 'Default profile',
            header: {
              text: 'default',
              url: '',
            },
            author: {
              text: 'default',
              url: '',
            },
            title: 'default',
            description: 'default',
            color: 'random',
          },
        ],
      },
    },
    domains: {
      type: [
        {
          name: String,
          subDomain: String,
          fake: Boolean,
          embeds: [String],
          fileNamePrefix: String,
        },
      ],
      default: [
        {
          name: 'imgs.bar',
          subDomain: 'beta',
          fake: false,
          embeds: ['default'],
          fileNamePrefix: '',
        },
      ],
    },
  },
});

export const User: Model<User> = model('User', UserSchema);
