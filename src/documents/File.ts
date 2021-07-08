import {Document, model, Model, Schema} from 'mongoose';

interface File extends Document {
  /**
   * name of File
   *
   */
  fileName: string;

  /**
   * original file name.
   *
   */
  originalFileName: string;

  //Hash of file
  hash: string;

  /**
   * Size of file in bytes
   *
   */
  size: number;

  /**
   * UUID of file uploader
   *
   */
  uploader: string;

  //The files embed, won't update.
  embed: {
    //The domain's ID
    _id: string;

    //If the image should embed
    enabled: boolean;

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
  };
}

const FileSchema: Schema = new Schema({
  fileName: String,
  originalFileName: String,
  hash: String,
  uploader: String,
  size: Number,
  embed: {
    _id: String,
    enabled: Boolean,
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
});

export const File: Model<File> = model('File', FileSchema);
