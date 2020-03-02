import mongoose from 'mongoose';
import { IUser } from '../interfaces';

type UserDocument = IUser & mongoose.Document;

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    real_name: {
      type: String,
    },
    display_name: {
      type: String,
    },
  },
  { strict: false },
);

export const User = mongoose.model<UserDocument>('User', userSchema);
