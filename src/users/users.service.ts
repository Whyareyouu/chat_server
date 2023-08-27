import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Op } from 'sequelize';
import { FileService } from '../file/file.service';
import { decode } from 'jsonwebtoken';
@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private fileService: FileService,
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    return user;
  }

  async findByPk(id: string): Promise<User | null> {
    return this.userRepository.findByPk(id);
  }

  async findByUsername(sanitizedUsername: string) {
    const users = await this.userRepository.findAll({
      where: {
        username: {
          [Op.iLike]: `%${sanitizedUsername}%`,
        },
      },
    });
    return users;
  }
  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }
}
