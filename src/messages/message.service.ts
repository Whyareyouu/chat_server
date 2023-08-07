import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';
import { MessageDto } from './dto/message.dto';
import { Op } from 'sequelize';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message) private readonly messageModel: typeof Message,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageModel.findAll();
  }

  async findById(id: string): Promise<Message | null> {
    return this.messageModel.findByPk(id);
  }

  async createMessage(message: MessageDto): Promise<Message> {
    return this.messageModel.create(message);
  }

  async updateMessage(message: Message): Promise<Message> {
    await this.messageModel.update(message, { where: { id: message.id } });
    return message;
  }

  async deleteMessage(id: string): Promise<boolean> {
    const deletedRows = await this.messageModel.destroy({ where: { id } });
    return deletedRows > 0;
  }
  async findAllMessagesBetweenUsers(senderId: string, recipientId: string) {
    // Выполняем запрос к базе данных, чтобы найти все сообщения между заданными отправителем и получателем
    const messages = await this.messageModel.findAll({
      where: {
        // Используем условие "или", чтобы найти сообщения, где отправитель равен senderId И получатель равен recipientId
        // или отправитель равен recipientId И получатель равен senderId
        [Op.or]: [
          {
            senderId,
            recipientId,
          },
          {
            senderId: recipientId,
            recipientId: senderId,
          },
        ],
      },
    });

    return messages;
  }
}
