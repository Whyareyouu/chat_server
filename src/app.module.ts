import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { UserRepository } from './users/users.service';
import { User } from './users/users.model';
import { Message } from './messages/message.model';
import { SocketAppModule } from './socket/socket.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User, Message],
      autoLoadModels: true,
    }),
    SequelizeModule.forFeature([User, Message]),
    UsersModule,
    SocketAppModule, // Добавляем модуль сокетов
  ],
  controllers: [UsersController],
  providers: [UserRepository],
})
export class AppModule {}
