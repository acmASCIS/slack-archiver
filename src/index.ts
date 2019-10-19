import dotenv from 'dotenv';
import cron from 'node-cron';
import mongoose from 'mongoose';

dotenv.config();

import { archive } from './archive';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/archiver';
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connected sucessfully');
  });

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

const Channel = mongoose.model('Channel', channelSchema);

async function save() {
  const channels = (await archive()) as any[];
  channels.forEach(async channel => {
    let dbChannel: any = await Channel.findOne({ id: channel.id });
    if (!dbChannel) {
      Channel.create(channel);
    } else {
      const combinedMessages = [...channel.messages, ...dbChannel.messages];
      const messages = [];
      const messagesMap: Map<string, boolean> = new Map<string, boolean>();

      for (let message of combinedMessages) {
        if (!messagesMap.get(message.ts)) {
          messagesMap.set(message.ts, true);
          messages.push(message);
        }
      }

      await Channel.findOneAndUpdate(
        { id: dbChannel.id },
        { ...channel, messages },
      );
    }
  });
}

cron.schedule('0 40 18 * * *', () => {
  console.log('Cron job is running');
  save();
});
