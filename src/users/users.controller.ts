import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UserRepository } from './users.service';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { GetEmailByToken } from './getUserByToken';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserRepository) {}
  @UseGuards(JwtAuthGuard)
  @Get('/getMe')
  getMe(@GetEmailByToken() email: string) {
    return this.usersService.getUserByEmail(email);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
