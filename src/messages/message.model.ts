import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { User } from '../users/users.model';

interface MessageAttrs {
  senderId: string;
  recipientId: string;
  content: string;
}

@Table
export class Message extends Model<Message, MessageAttrs> {
  @ForeignKey(() => User)
  @Column
  senderId: string;

  @ForeignKey(() => User)
  @Column
  recipientId: string;

  @Column(DataType.TEXT)
  content: string;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @BelongsTo(() => User, 'recipientId')
  recipient: User;
}
