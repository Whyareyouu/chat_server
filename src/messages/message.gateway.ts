import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message } from './message.model';
import { MessageRepository } from './message.service';
import { UserRepository } from '../users/users.service';

@WebSocketGateway()
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    // Логика, выполняемая при подключении клиента
    console.log('Client connected:', socket.id);
  }

  async handleDisconnect(socket: Socket) {
    // Логика, выполняемая при отключении клиента
    console.log('Client disconnected:', socket.id);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    socket: Socket,
    data: { senderId: number; recipientId: number; content: string },
  ) {
    const { senderId, recipientId, content } = data;

    // Проверяем наличие отправителя и получателя в базе данных
    const [sender, recipient] = await Promise.all([
      this.userRepository.findByPk(senderId),
      this.userRepository.findByPk(recipientId),
    ]);

    if (!sender || !recipient) {
      return;
    }

    // Сохраняем сообщение в базу данных
    await this.messageRepository.createMessage({
      senderId,
      recipientId,
      content,
    });

    // Отправляем сообщение отправителю и получателю
    this.server
      .to(senderId.toString())
      .to(recipientId.toString())
      .emit('chatMessage', { senderId, recipientId, content });
  }
}
