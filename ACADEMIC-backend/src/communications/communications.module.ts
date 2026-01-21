import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { InternalMessage } from './entities/internal-message.entity';
import { CommunicationsService } from './communications.service';
import { CommunicationsController } from './communications.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, InternalMessage])
  ],
  controllers: [CommunicationsController],
  providers: [CommunicationsService],
  exports: [CommunicationsService]
})
export class CommunicationsModule { }