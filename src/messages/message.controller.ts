import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { MessageRepository } from './message.service';
import { Message } from './message.model';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageRepository) {}

  @Post()
  getUserContactsAndLastMessages(@Body('id') id: string) {
    return this.messageService.getUserContactsAndLastMessages(id);
  }
  @Delete('/delete')
  deleteMessage(@Body('id') id: string) {
    return this.messageService.deleteMessage(id);
  }
  @Patch('/update')
  updateMessage(@Body('message') message: Message) {
    return this.messageService.updateMessage(message);
  }
}
