import { IReply } from './IReply';

export interface IMessage {
  ts: string;
  text: string;
  user: string;
  reply_count: number;
  replies: IReply[];
}
