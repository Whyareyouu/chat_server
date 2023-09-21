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
  async handleMessagesGet(data: { senderId: string; recipientId: string }) {
    const { senderId, recipientId } = data;

    const messages = await this.messageRepository.findAllMessagesBetweenUsers(
      senderId,
      recipientId,
    );

    this.server.emit('messages', messages);
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
    this.handleMessagesGet({ senderId, recipientId });
  }
  @SubscribeMessage('message:put')
  async handleMessagePut(message: Message): Promise<void> {
    const updatedMessage = await this.messageRepository.updateMessage(message);
    this.server.emit('message:put', updatedMessage);
    this.handleMessagesGet({
      senderId: message.senderId,
      recipientId: message.recipientId,
    });
  }
  @SubscribeMessage('message:delete')
  async handleMessageDelete(message: Message): Promise<void> {
    const deletedMessage = await this.messageRepository.deleteMessage(
      message.id,
    );
    this.server.emit('message:delete', deletedMessage);
    this.handleMessagesGet({
      senderId: message.senderId,
      recipientId: message.recipientId,
    });
  }
}
// @SubscribeMessage('sendMessage')
// async handleMessage(
//     socket: Socket,
//     data: { senderId: string; recipientId: string; content: string },
// ) {
//   // Получаем данные из сообщения, отправляемого клиентом
//   const { senderId, recipientId, content } = data;
//
//   // Создаем новое сообщение
//   const newMessage: MessageDto = {
//     senderId,
//     recipientId,
//     content,
//   };
//
//   // Сохраняем сообщение в базе данных
//   const createdMessage = await this.messageRepository.createMessage(
//       newMessage,
//   );
//
//   // Отправляем новое сообщение всем клиентам, подписанным на событие 'receiveMessages'
//   this.server.emit('receiveMessages', createdMessage);
// }
//
// @SubscribeMessage('getMessages')
// async handleGetMessages(
//     socket: Socket,
//     data: { senderId: string; recipientId: string },
// ) {
//   // Получаем данные из запроса на получение сообщений
//   const { senderId, recipientId } = data;
//
//   // Получаем все сообщения между заданными отправителем и получателем из базы данных
//   const messages = await this.messageRepository.findAllMessagesBetweenUsers(
//       senderId,
//       recipientId,
//   );
//
//   // Отправляем сообщения клиенту, который сделал запрос, с помощью события 'receiveMessages'
//   socket.emit('receiveMessages', messages);
// }
