import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherProfile } from './entities/teacher-profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherProfile])],
  controllers: [],
  providers: [],
})
export class TeacherModule {}
