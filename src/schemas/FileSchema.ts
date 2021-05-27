import {Document, model, Model, Schema} from 'mongoose';

interface File extends Document {
  fileName: string;
  hash: string;
}
const FileSchema: Schema = new Schema({
  fileName: {type: String, required: true},
  hash: {type: String, required: true},
});

export const File: Model<File> = model('File', FileSchema);
