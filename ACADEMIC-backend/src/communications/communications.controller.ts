import { Controller, Get, Param, Patch } from '@nestjs/common';
import { CommunicationsService } from './communications.service';

@Controller('communications')
export class CommunicationsController {
    constructor(private readonly commsService: CommunicationsService) { }

    @Get('notifications/:userId')
    getNotifications(@Param('userId') userId: string) {
        return this.commsService.getStudentNotifications(userId);
    }

    @Patch('notifications/:id/read')
    markRead(@Param('id') id: string) {
        return this.commsService.markAsRead(id);
    }
}