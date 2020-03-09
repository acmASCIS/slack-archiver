import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import { Channel } from './models/channel.model';
import { injectUser } from './helpers/injectUser';
import { IReply, IMessage } from './interfaces';
import { User } from './models/user.model';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/archiver';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log('Server is running');
});

app.get('/state', (req: any, res: any) => {
  res.send();
});

app.get('/backup/:channel', async (req: any, res: any) => {
  const name = req.params.channel;
  const channel = await Channel.findOne({ name });
  const users = await User.find({});

  const messages = channel?.messages.map((msg: IMessage) => {
    msg = (msg as any)._doc;

    const replies = msg.replies?.map((reply: IReply) => ({
      text: injectUser(reply.text, users),
      ts: new Date(parseInt(reply.ts) * 1000).toLocaleString(),
      user: reply.user ? users.find(u => u.id === reply.user)?.name : undefined,
    }));

    return {
      text: injectUser(msg.text, users),
      ts: new Date(parseInt(msg.ts) * 1000).toLocaleString(),
      replies,
      user: msg.user ? users.find(u => u.id === msg.user)?.name : undefined,
    };
  });

  res.json({ channel: name, messages });
});
