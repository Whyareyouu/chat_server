import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { Op } from 'sequelize';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserRepository {
  constructor(@InjectModel(User) private userRepository: typeof User) {}

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);
    const { id, username } = user;
    return { id, username };
  }

  async createUser(dto: CreateUserDto) {
    const candidate = await this.getUserByEmail(dto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email, уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(dto.password, 5);
    const user = await this.userRepository.create({
      ...dto,
      password: hashPassword,
    });
    const { id, username } = user;
    return { id, username };
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
  private async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });
    return user;
  }
  private async validateUser(dto: CreateUserDto) {
    const user = await this.getUserByEmail(dto.email);
    const passwordEquals = await bcrypt.compare(dto.password, user.password);
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректная почта или пароль',
    });
  }
}
