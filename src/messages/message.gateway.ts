import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageRepository } from './message.service';
import { MessageDto } from './dto/message.dto';
import { Message } from './message.model';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messageRepository: MessageRepository) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    console.log('Client connected:', socket.id);
  }

  async handleDisconnect(socket: Socket) {
    // Логика, выполняемая при отключении клиента
    console.log('Client disconnected:', socket.id);
  }

  //@todo Додедлать методы
  @SubscribeMessage('message:get')
  async handleMessagesGet(socket: Socket, data: { senderId; recipientId }) {
    const { senderId, recipientId } = data;
    if (!senderId || !recipientId) {
      return;
    }
    const messages = await this.messageRepository.findAllMessagesBetweenUsers(
      senderId,
      recipientId,
    );
    socket.emit('messages', messages);
  }

  @SubscribeMessage('message:post')
  async handleMessagePost(
    socket: Socket,
    data: { senderId: string; recipientId: string; content: string },
  ) {
    const { senderId, recipientId, content } = data;
    const newMessage: MessageDto = {
      senderId,
      recipientId,
      content,
    };
    const createdMessage = await this.messageRepository.createMessage(
      newMessage,
    );
    socket.emit('message:post', createdMessage);
    this.handleMessagesGet(socket, { senderId, recipientId });
  }
  @SubscribeMessage('message:put')
  async handleMessagePut(socket: Socket, message: Message): Promise<void> {
    const updatedMessage = await this.messageRepository.updateMessage(message);
    socket.emit('message:put', updatedMessage);
    this.handleMessagesGet(socket, {
      senderId: message.senderId,
      recipientId: message.recipientId,
    });
  }
  @SubscribeMessage('message:delete')
  async handleMessageDelete(socket: Socket, message: Message): Promise<void> {
    const deletedMessage = await this.messageRepository.deleteMessage(
      message.id,
    );
    socket.emit('message:delete', deletedMessage);
    this.handleMessagesGet(socket, {
      senderId: message.senderId,
      recipientId: message.recipientId,
    });
  }
}
