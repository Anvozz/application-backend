import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { CreateUSerDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ServiceResponse } from '@app/common';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(request: CreateUSerDto) {
    const response = new ServiceResponse<User>();
    const { tel, email, username } = request;
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('username = :username ', { username })
      .orWhere('email = :email', { email })
      .orWhere('tel = :tel', { tel })
      .execute();
    if (user.length >= 1) {
      response.message = 'Email | Tel | Username already exist';
      response.statusCode = HttpStatus.BAD_REQUEST;
      response.success = false;
      return response;
    }
    // Hashing password //
    request.password = bcrypt.hashSync(request.password, 10);
    response.data = await this.usersRepository.save(request);
    return response;
  }

  async getUser(request) {
    const responseuser = await this.usersRepository.findOneBy(request);
    return responseuser;
  }
}
