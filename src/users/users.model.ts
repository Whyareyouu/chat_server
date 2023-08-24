import {
  Column,
  DataType,
  Model,
  Table,
  HasMany,
  Default,
  PrimaryKey,
} from 'sequelize-typescript';
import { Message } from '../messages/message.model';

interface UserCreationAttrs {
  username: string;
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  id: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username: string;
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;
  @HasMany(() => Message, 'senderId')
  sentMessages: Message[];
  @HasMany(() => Message, 'recipientId')
  receivedMessages: Message[];
}
