import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ChatAttrs {
  message: string;
}

@Table({ tableName: 'Messages' })
export class Chat extends Model<Chat, ChatAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;
  @Column({ type: DataType.STRING, allowNull: false })
  message: string;
}
