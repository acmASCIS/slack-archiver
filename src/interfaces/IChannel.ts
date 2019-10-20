import { IMessage } from './IMessage';

export interface IChannel {
  id: string;
  name: string;
  messages: IMessage[];
}
