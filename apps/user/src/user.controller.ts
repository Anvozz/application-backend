import { Controller, Get, Response } from '@nestjs/common';
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
  async handleGetuser(@Payload() data: any, @Ctx() context: RmqContext) {
    const resp = await this.userService.getUser(data);
    this.rmqService.ack(context);
    return resp;
  }

  @EventPattern('create_user')
  async handleCreateuser(@Payload() data: any, @Ctx() context: RmqContext) {
    const resp = this.userService.createUser(data);
    this.rmqService.ack(context);
    return resp;
  }

  // @EventPattern('find_user')
  // async handleFinduser() {}
}
