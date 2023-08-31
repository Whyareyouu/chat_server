import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Op } from 'sequelize';
import { FileService } from '../file/file.service';
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

  async updateUserAvatar(email, avatar) {
    const user = await this.getUserByEmail(email);
    const allowedExtensions = ['.jpg', '.png', '.jpeg'];
    const newUserAvatar = await this.fileService.createFile(
      avatar,
      allowedExtensions,
    );
    user.avatar = newUserAvatar;
    await user.save();
    return user;
  }

  async updateUserProfile(email: string, dto: CreateUserDto) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }
    if (dto.name) {
      user.name = dto.name;
    }
    if (dto.username) {
      user.username = dto.username;
    }
    await user.save();
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
