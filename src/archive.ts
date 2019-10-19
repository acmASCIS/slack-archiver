import { WebClient } from '@slack/web-api';

export async function archive() {
  const client = new WebClient(process.env.SLACK_TOKEN);
  const channels = await getChannels(client);

  for (const channel of channels as any[]) {
    channel.messages = [];
    const { messages } = await client.conversations.history({
      channel: channel.id,
    });

    for (const message of messages as any[]) {
      if (message.reply_count) {
        const { messages } = await client.conversations.replies({
          channel: channel.id,
          ts: message.ts,
        });
        const [thread, ...replies] = messages as any[];
        message.replies = replies;
      }

      channel.messages.push(message);
    }
  }

  return channels;
}

async function getChannels(client: WebClient) {
  const { channels } = await client.conversations.list({
    types: 'private_channel,public_channel,mpim,im',
  });

  return channels;
}
