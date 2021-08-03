import {Document, model, Model, Schema} from 'mongoose';

interface Domain extends Document {
  /**
   * The Unique ID of the paste
   */
  _id: string;

  /**
   * The content of the paste
   */
  content: string;

  /**
   * If the paste should be removed once viewed
   */
  deleteOnView: boolean;

  /**
   * Hashed password to access the paste
   */
  password: string;

  /**
   * UUID of the paste creator
   */
  createdBy: string;

  /**
   * Unix time when the pastes automatically gets deleted.
   */
  expiresAt: number;

  /**
   * Date when the paste was created.
   */
  createdAt: Date;
}

const PasteSchema: Schema = new Schema({
  _id: String,
  content: String,
  deleteOnView: {type: Boolean, default: false},
  password: String,
  createdBy: String,
  expiresAt: Date,
  createdAt: {type: Date, default: Date.now},
});

export const Domain: Model<Domain> = model('Paste', PasteSchema);
