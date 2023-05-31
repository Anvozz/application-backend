import { Inject, Injectable } from '@nestjs/common';
import { USER_SERVICE } from '../constants/service';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject(USER_SERVICE) private userClient: ClientProxy) {}
  getHello() {
    this.userClient.emit('get_user', 1);
    const user = this.userClient.send('', 1);
    return 'Hello World!';
  }
}
