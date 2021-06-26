import {Document, model, Model, Schema} from 'mongoose';

interface File extends Document {
  //The filename stored.
  fileName: string;

  //The filename stored.
  originalFileName: string;

  //Hash of file
  hash: string;

  //UUID of uploader
  uploader: string;
}
const FileSchema: Schema = new Schema({
  fileName: String,
  originalFileName: String,
  hash: String,
  uploader: String,
});

export const File: Model<File> = model('File', FileSchema);
