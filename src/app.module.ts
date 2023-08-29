import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UserRepository } from './users/users.service';
import { User } from './users/users.model';
import { Message } from './messages/message.model';
import { SocketAppModule } from './socket/socket.module';
import { UsersModule } from './users/users.module';
import { MessageController } from './messages/message.controller';
import { MessageRepository } from './messages/message.service';
import { FileModule } from './file/file.module';
import { AuthModule } from './Auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Message],
      autoLoadModels: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'client'),
    }),
    SequelizeModule.forFeature([User, Message]),
    UsersModule,
    SocketAppModule,
    AuthModule,
    FileModule,
  ],
  controllers: [UsersController, MessageController],
  providers: [UserRepository, MessageRepository],
})
export class AppModule {}
