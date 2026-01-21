import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';

@Controller('student')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class StudentController {
    constructor(private readonly studentService: StudentService) { }

    @Get('profile/:userId')
    getProfile(@Param('userId') userId: string) {
        return this.studentService.getStudentProfile(userId);
    }
    @Get('dashboard/summary/:userId')
    getDashboardSummary(@Param('userId') userId: string) {
        return this.studentService.getDashboardSummary(userId);
    }
}