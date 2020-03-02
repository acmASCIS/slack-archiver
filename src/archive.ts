import { WebClient } from '@slack/web-api';
import { IChannel, IMessage, IReply, IUser } from './interfaces';

export async function archive() {
  const client = new WebClient(process.env.SLACK_TOKEN);
  const channels: IChannel[] = await getChannels(client);
  const users = await getUsers(client);

  for (const channel of channels) {
    channel.messages = [];
    const { messages } = await client.conversations.history({
      channel: channel.id,
    });

    for (const message of messages as IMessage[]) {
      if (message.reply_count) {
        const { messages: replies } = await client.conversations.replies({
          channel: channel.id,
          ts: message.ts,
        });
        const [thread, ...rest] = replies as IReply[];
        message.replies = rest;
      }

      channel.messages.push(message);
    }
  }

  return { channels, users };
}

async function getChannels(client: WebClient): Promise<IChannel[]> {
  const { channels } = await client.conversations.list({
    types: 'private_channel,public_channel,mpim,im',
  });

  return channels as IChannel[];
}

async function getUsers(client: WebClient): Promise<IUser[]> {
  const { members } = await client.users.list();

  return members as IUser[];
}
