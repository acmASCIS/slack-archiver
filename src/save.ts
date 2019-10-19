import { Channel } from './channel.model';
import { archive } from './archive';

export async function save() {
  const channels = (await archive()) as any[];
  const promises = channels.map(async channel => {
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

  await Promise.all(promises);
}
