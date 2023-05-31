import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { RmqService } from '@app/common';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('get_user')
  async handleGetuser(@Payload() id: number, @Ctx() context: RmqContext) {
    console.log('GETUSERS => ', id);
    this.rmqService.ack(context);
  }
}
