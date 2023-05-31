import {
  HttpException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { USER_SERVICE } from '../../constants/service';
import { ClientProxy } from '@nestjs/microservices';
import { ServiceResponse } from '@app/common';
import { lastValueFrom } from 'rxjs';
import { User } from 'apps/user/src/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as _ from 'lodash';

export interface TokenPayload {
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_SERVICE) private userClient: ClientProxy,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async createUser(request) {
    const create_user: ServiceResponse<any> = await lastValueFrom(
      this.userClient.send('create_user', request),
    );
    if (!create_user.success)
      throw new HttpException(create_user.message, create_user.statusCode);
    return create_user;
  }

  async login(user: User, response: Response) {
    const tokenPayload: TokenPayload = {
      userId: user.id,
    };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRATION'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });
  }

  logout(response: Response) {
    response.cookie('Authentication', '', {
      httpOnly: true,
      expires: new Date(),
    });
  }

  async validateUser(email: string, password: string) {
    const user: User = await lastValueFrom(
      this.userClient.send('get_user', { email }),
    );
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return _.omit(user, ['password']);
  }

  async getUser(getUserArgs: Partial<User>) {
    const user: User = await lastValueFrom(
      this.userClient.send('get_user', getUserArgs),
    );
    return _.omit(user, ['password']);
  }
}
