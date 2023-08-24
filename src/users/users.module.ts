import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { UserRepository } from './users.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [SequelizeModule.forFeature([User]), FileModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
