import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import { Message } from '../messages/message.model';

interface UserCreationAttrs {
  username: string;
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  username: string;
  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;
  @HasMany(() => Message, 'senderId')
  sentMessages: Message[];
  @HasMany(() => Message, 'recipientId')
  receivedMessages: Message[];
}
