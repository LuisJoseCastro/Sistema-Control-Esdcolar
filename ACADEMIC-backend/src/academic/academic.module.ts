import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicService } from './service/academic.service';
import { AcademicController } from './controllers/academic.controller';

import { TeacherProfile } from '../teacher/entities/teacher-profile.entity';
import { Course } from './entities/course.entity';
import { GradeCard } from './entities/grade-card.entity';
import { AttendanceDetail } from './entities/attendance-detail.entity';
import { Group } from './entities/group.entity';
import { Enrollment } from './entities/enrollment.entity';
import { Subject } from './entities/subject.entity';
import { Schedule } from './entities/schedule.entity';
import { AcademicPeriod } from './entities/academic-period.entity';
import { InternalMessage } from '../communications/entities/internal-message.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TeacherProfile,
      Course,
      GradeCard,
      AttendanceDetail,
      Group,
      Enrollment,
      Subject,
      Schedule,
      AcademicPeriod,
      InternalMessage,
      User,
    ]),
  ],
  controllers: [AcademicController],
  providers: [AcademicService],
  exports: [AcademicService],
})
export class AcademicModule {}
