import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './message.model';
import { MessageRepository } from './message.service';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
  providers: [MessageRepository], // Проверьте, что MessageRepository объявлен как провайдер
  exports: [MessageRepository], // Проверьте, что MessageRepository экспортируется
})
export class MessageModule {}
