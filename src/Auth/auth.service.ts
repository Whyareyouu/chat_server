import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/users.model';
import { UserRepository } from '../users/users.service';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    const token = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return {
      ...token,
      ...refreshToken,
    };
  }

  async registration(userDto: CreateUserDto) {
    const candidate = await this.userRepository.getUserByEmail(userDto.email);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким email, уже существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userRepository.createUser({
      ...userDto,
      password: hashPassword,
    });
    const token = await this.generateToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    return { ...token, ...refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.userRepository.getUserByEmail(decoded.email);
      return this.generateToken(user);
    } catch (error) {
      throw new UnauthorizedException('Некорректный токен обновления');
    }
  }

  private async generateRefreshToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return {
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  private async generateToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };
    return {
      token: this.jwtService.sign(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userRepository.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Некорректная почта или пароль',
    });
  }
}
