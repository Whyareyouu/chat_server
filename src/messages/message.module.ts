import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './message.model';
import { MessageRepository } from './message.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([Message]), UsersModule],
  providers: [MessageRepository],
  exports: [MessageRepository],
})
export class MessageModule {}
