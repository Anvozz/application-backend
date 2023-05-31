import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CurrentUser } from '../current-user.decorator';
import { User } from 'apps/user/src/entity/user.entity';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import JwtAuthGuard from '../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async handleRegister(@Body() request) {
    return this.authService.createUser(request);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async handleLogin(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.status(HttpStatus.OK);
    response.send(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async handleTest(@CurrentUser() user: User) {
    return user || 'Hello';
  }
}
