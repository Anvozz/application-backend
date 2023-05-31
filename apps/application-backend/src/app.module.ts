import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { RmqModule } from '@app/common';
import { USER_SERVICE } from '../constants/service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RmqModule.register({
      name: USER_SERVICE,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
