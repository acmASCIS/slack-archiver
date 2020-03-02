import { Channel } from './models/channel.model';
import { archive } from './archive';
import { User } from './models/user.model';
export async function save() {
  const { channels, users } = await archive();

  const userUpdates = users.map(async user => {
    const dbUser = await User.findOne({ id: user.id });
    if (!dbUser) {
      await User.create(user);
    } else {
      await User.findOneAndUpdate({ id: dbUser.id }, user);
    }
  });

  const channelUpdates = channels.map(async channel => {
    const dbChannel = await Channel.findOne({ id: channel.id });
    if (!dbChannel) {
      await Channel.create(channel);
    } else {
      const combinedMessages = [...channel.messages, ...dbChannel.messages];
      const messages = [];
      const messagesMap: Map<string, boolean> = new Map<string, boolean>();

      for (const message of combinedMessages) {
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

  await Promise.all([...userUpdates, ...channelUpdates]);
}
