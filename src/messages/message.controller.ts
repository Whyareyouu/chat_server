import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageRepository } from './message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageRepository) {}

  @Post()
  getUserContactsAndLastMessages(@Body('id') id: string) {
    return this.messageService.getUserContactsAndLastMessages(id);
  }
}
