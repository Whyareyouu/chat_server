import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserRepository } from './users.service';
import { JwtAuthGuard } from '../Auth/jwt-auth.guard';
import { GetEmailByToken } from './getUserByToken';
import { CreateUserDto } from './dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UserRepository) {}
  @UseGuards(JwtAuthGuard)
  @Get('/getMe')
  getMe(@GetEmailByToken() email: string) {
    return this.usersService.getUserByEmail(email);
  }
  @Post('/updateAvatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  updateUserAvatar(@GetEmailByToken() email: string, @UploadedFile() avatar) {
    return this.usersService.updateUserAvatar(email, avatar);
  }

  @Post('/updateUser')
  @UseGuards(JwtAuthGuard)
  updateUser(@GetEmailByToken() email: string, @Body() user: CreateUserDto) {
    return this.usersService.updateUserProfile(email, user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/search/:username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }
}
