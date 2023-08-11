import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageRepository } from './message.service';
import { UserRepository } from '../users/users.service';
import { MessageDto } from './dto/message.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
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
    data: { senderId: string; recipientId: string; content: string },
  ) {
    // Получаем данные из сообщения, отправляемого клиентом
    const { senderId, recipientId, content } = data;

    // Создаем новое сообщение
    const newMessage: MessageDto = {
      senderId,
      recipientId,
      content,
    };

    // Сохраняем сообщение в базе данных
    const createdMessage = await this.messageRepository.createMessage(
      newMessage,
    );

    // Отправляем новое сообщение всем клиентам, подписанным на событие 'receiveMessages'
    this.server.emit('receiveMessages', createdMessage);
  }

  @SubscribeMessage('getMessages')
  async handleGetMessages(
    socket: Socket,
    data: { senderId: string; recipientId: string },
  ) {
    // Получаем данные из запроса на получение сообщений
    const { senderId, recipientId } = data;

    // Получаем все сообщения между заданными отправителем и получателем из базы данных
    const messages = await this.messageRepository.findAllMessagesBetweenUsers(
      senderId,
      recipientId,
    );

    // Отправляем сообщения клиенту, который сделал запрос, с помощью события 'receiveMessages'
    socket.emit('receiveMessages', messages);
  }
}
