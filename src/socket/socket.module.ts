import { Module } from '@nestjs/common';
import { MessageGateway } from '../messages/message.gateway';
import { SocketModule } from '@nestjs/websockets/socket-module';
import { UsersModule } from '../users/users.module';
import { MessageModule } from '../messages/message.module';

@Module({
  imports: [SocketModule, MessageModule, UsersModule],
  providers: [MessageGateway, MessageModule, UsersModule],
})
export class SocketAppModule {}
