import { WebClient } from '@slack/web-api';
import { IChannel, IMessage, IReply } from './interfaces';

export async function archive() {
  const client = new WebClient(process.env.SLACK_TOKEN);
  const channels: IChannel[] = await getChannels(client);

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

  return channels;
}

async function getChannels(client: WebClient): Promise<IChannel[]> {
  const { channels } = await client.conversations.list({
    types: 'private_channel,public_channel,mpim,im',
  });

  return channels as IChannel[];
}
