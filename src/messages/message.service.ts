import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message) private readonly messageModel: typeof Message,
  ) {}

  async findAll(): Promise<Message[]> {
    return this.messageModel.findAll();
  }

  async findById(id: number): Promise<Message | null> {
    return this.messageModel.findByPk(id);
  }

  async createMessage(message: MessageDto): Promise<Message> {
    return this.messageModel.create(message);
  }

  async updateMessage(message: Message): Promise<Message> {
    await this.messageModel.update(message, { where: { id: message.id } });
    return message;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const deletedRows = await this.messageModel.destroy({ where: { id } });
    return deletedRows > 0;
  }
}
