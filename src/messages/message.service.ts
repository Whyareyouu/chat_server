import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './message.model';
import { MessageDto } from './dto/message.dto';
import { Op, Sequelize } from 'sequelize';
import { UserRepository } from '../users/users.service';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectModel(Message) private readonly messageModel: typeof Message,
    private readonly userRepository: UserRepository,
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
  async getUserContactsAndLastMessages(userId: string): Promise<any[]> {
    // Получаем список всех контактов (пользователей), с которыми общался пользователь
    const contacts = await this.messageModel.findAll({
      where: {
        [Op.or]: [{ senderId: userId }, { recipientId: userId }],
      },
      attributes: [
        [
          Sequelize.literal(
            `(CASE WHEN "Message"."senderId" = :userId THEN "Message"."recipientId" ELSE "Message"."senderId" END)`,
          ),
          'contactId',
        ],
      ],
      replacements: { userId },
      group: ['contactId'],
    });

    // Для каждого контакта находим его последнее сообщение
    const contactsWithLastMessages = await Promise.all(
      contacts.map(async (contact: any) => {
        const lastMessage = await this.messageModel.findOne({
          where: {
            [Op.or]: [
              {
                senderId: userId,
                recipientId: contact.getDataValue('contactId'),
              },
              {
                senderId: contact.getDataValue('contactId'),
                recipientId: userId,
              },
            ],
          },
          order: [['createdAt', 'DESC']],
        });

        const user = await this.userRepository.findByPk(
          contact.getDataValue('contactId'),
        );

        return {
          contactId: contact.getDataValue('contactId'),
          username: user ? user.getDataValue('username') : null,
          avatar: user.avatar ? user.getDataValue('avatar') : null,
          lastMessage: lastMessage ? lastMessage.getDataValue('content') : null,
        };
      }),
    );

    return contactsWithLastMessages;
  }
}
