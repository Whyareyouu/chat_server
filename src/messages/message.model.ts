import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  DataType,
  PrimaryKey,
  Default,
} from 'sequelize-typescript';
import { User } from '../users/users.model';

interface MessageAttrs {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
}

@Table
export class Message extends Model<Message, MessageAttrs> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  @Column
  senderId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  @Column
  recipientId: string;

  @Column(DataType.TEXT)
  content: string;

  @BelongsTo(() => User, 'senderId')
  sender: User;

  @BelongsTo(() => User, 'recipientId')
  recipient: User;
}
