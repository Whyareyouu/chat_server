import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { decode } from 'jsonwebtoken';

export const GetEmailByToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    if (!token) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
    try {
      const decodedToken: any = decode(token);
      return decodedToken.email;
    } catch (error) {
      throw new HttpException(
        'Возникла ошибка',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  },
);
