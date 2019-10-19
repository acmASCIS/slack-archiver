import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    ts: {
      type: String,
    },
  },
  { strict: false, _id: false },
);
const channelSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
    },
    messages: [messageSchema],
  },
  { strict: false },
);

export const Channel = mongoose.model('Channel', channelSchema);
