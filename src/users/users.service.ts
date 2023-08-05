import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Op } from 'sequelize';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const { id, username } = user;
    return { id, username };
  }
  async findByPk(id: number): Promise<User | null> {
    return this.userRepository.findByPk(id);
  }
  async findByUsername(sanitizedUsername: string) {
    const users = await this.userRepository.findAll({
      where: {
        username: {
          [Op.iLike]: `%${sanitizedUsername}%`,
        },
      },
      include: User,
    });
    return users;
  }
}
